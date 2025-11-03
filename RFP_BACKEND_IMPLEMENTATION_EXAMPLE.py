# RFP Manual Bid Submission - Backend Implementation Example
# This is a reference implementation for Django REST Framework

"""
ENDPOINT: POST /api/v1/procurements/manaul-bid/
Content-Type: multipart/form-data

This endpoint receives RFP submissions with file uploads from the frontend.
"""

from rest_framework import serializers, viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import models, transaction
import json


# ===== MODELS =====

class RFPSubmission(models.Model):
    """Main RFP submission model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    solicitation = models.ForeignKey('Solicitation', on_delete=models.CASCADE)
    vendor = models.ForeignKey('Vendor', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'rfp_submissions'


class RFPSubmissionDocument(models.Model):
    """Document uploads for RFP submissions"""
    DOCUMENT_TYPES = [
        ('technical', 'Technical'),
        ('commercial', 'Commercial'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    submission = models.ForeignKey(RFPSubmission, on_delete=models.CASCADE)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='rfp_submissions/%Y/%m/%d/')
    file_name = models.CharField(max_length=255)
    file_size = models.IntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'rfp_submission_documents'


class RFPSubmissionEvaluation(models.Model):
    """Evaluation criteria responses"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    submission = models.ForeignKey(RFPSubmission, on_delete=models.CASCADE)
    evaluation_criteria = models.ForeignKey('EvaluationCriteria', on_delete=models.CASCADE)
    response = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'rfp_submission_evaluations'


# ===== SERIALIZERS =====

class RFPSubmissionDocumentSerializer(serializers.ModelSerializer):
    """Serializer for document responses"""
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = RFPSubmissionDocument
        fields = ['id', 'file_url', 'file_name', 'file_size', 'uploaded_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            return request.build_absolute_uri(obj.file.url)
        return None


class RFPSubmissionEvaluationSerializer(serializers.ModelSerializer):
    """Serializer for evaluation responses"""
    class Meta:
        model = RFPSubmissionEvaluation
        fields = ['id', 'response', 'evaluation_criteria']


class RFPSubmissionSerializer(serializers.Serializer):
    """Main serializer for RFP submission"""

    # Required fields
    solicitation = serializers.UUIDField(required=True)
    vendor = serializers.UUIDField(required=True)

    # File uploads (multiple files allowed)
    technical_documents = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False),
        required=True,
        write_only=True
    )
    commercial_documents = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False),
        required=True,
        write_only=True
    )

    # Optional evaluations (sent as JSON string)
    evaluations = serializers.JSONField(required=False, allow_null=True)

    def validate_solicitation(self, value):
        """Validate solicitation exists and is active"""
        try:
            solicitation = Solicitation.objects.get(id=value)
            # Add your business logic here
            # if not solicitation.is_open():
            #     raise serializers.ValidationError("This RFP is no longer accepting submissions")
            return value
        except Solicitation.DoesNotExist:
            raise serializers.ValidationError("Solicitation not found")

    def validate_vendor(self, value):
        """Validate vendor exists and is approved"""
        try:
            vendor = Vendor.objects.get(id=value)
            if vendor.status != 'Approved':
                raise serializers.ValidationError("Vendor must be approved to submit bids")
            return value
        except Vendor.DoesNotExist:
            raise serializers.ValidationError("Vendor not found")

    def validate_technical_documents(self, value):
        """Validate technical documents"""
        if not value or len(value) == 0:
            raise serializers.ValidationError("At least one technical document is required")

        # Validate file types
        allowed_extensions = ['.pdf', '.doc', '.docx']
        for file in value:
            file_ext = os.path.splitext(file.name)[1].lower()
            if file_ext not in allowed_extensions:
                raise serializers.ValidationError(
                    f"Invalid file type: {file.name}. Only PDF, DOC, DOCX allowed."
                )

            # Validate file size (10MB = 10 * 1024 * 1024 bytes)
            if file.size > 10 * 1024 * 1024:
                raise serializers.ValidationError(
                    f"File {file.name} exceeds 10MB limit"
                )

        return value

    def validate_commercial_documents(self, value):
        """Validate commercial documents"""
        if not value or len(value) == 0:
            raise serializers.ValidationError("At least one commercial document is required")

        # Validate file types
        allowed_extensions = ['.pdf', '.doc', '.docx']
        for file in value:
            file_ext = os.path.splitext(file.name)[1].lower()
            if file_ext not in allowed_extensions:
                raise serializers.ValidationError(
                    f"Invalid file type: {file.name}. Only PDF, DOC, DOCX allowed."
                )

            # Validate file size (10MB)
            if file.size > 10 * 1024 * 1024:
                raise serializers.ValidationError(
                    f"File {file.name} exceeds 10MB limit"
                )

        return value

    def validate_evaluations(self, value):
        """Validate evaluations data"""
        if value:
            # If it's a string, parse it as JSON
            if isinstance(value, str):
                try:
                    value = json.loads(value)
                except json.JSONDecodeError:
                    raise serializers.ValidationError("Invalid JSON format for evaluations")

            # Validate structure
            if not isinstance(value, list):
                raise serializers.ValidationError("Evaluations must be an array")

            for item in value:
                if not isinstance(item, dict):
                    raise serializers.ValidationError("Each evaluation must be an object")
                if 'evaluation_criteria' not in item:
                    raise serializers.ValidationError("evaluation_criteria is required")

        return value

    @transaction.atomic
    def create(self, validated_data):
        """Create RFP submission with documents and evaluations"""

        # Extract data
        solicitation_id = validated_data['solicitation']
        vendor_id = validated_data['vendor']
        technical_docs = validated_data.pop('technical_documents')
        commercial_docs = validated_data.pop('commercial_documents')
        evaluations = validated_data.pop('evaluations', None)

        # Create main submission
        submission = RFPSubmission.objects.create(
            solicitation_id=solicitation_id,
            vendor_id=vendor_id
        )

        # Save technical documents
        for file in technical_docs:
            RFPSubmissionDocument.objects.create(
                submission=submission,
                document_type='technical',
                file=file,
                file_name=file.name,
                file_size=file.size
            )

        # Save commercial documents
        for file in commercial_docs:
            RFPSubmissionDocument.objects.create(
                submission=submission,
                document_type='commercial',
                file=file,
                file_name=file.name,
                file_size=file.size
            )

        # Save evaluations (if provided)
        if evaluations:
            for eval_data in evaluations:
                RFPSubmissionEvaluation.objects.create(
                    submission=submission,
                    evaluation_criteria_id=eval_data.get('evaluation_criteria'),
                    response=eval_data.get('response', '')
                )

        return submission


class RFPSubmissionResponseSerializer(serializers.ModelSerializer):
    """Serializer for response data"""
    technical_documents = serializers.SerializerMethodField()
    commercial_documents = serializers.SerializerMethodField()
    evaluations = RFPSubmissionEvaluationSerializer(
        source='rfpsubmissionevaluation_set',
        many=True,
        read_only=True
    )

    class Meta:
        model = RFPSubmission
        fields = [
            'id', 'solicitation', 'vendor', 'technical_documents',
            'commercial_documents', 'evaluations', 'created_at', 'updated_at'
        ]

    def get_technical_documents(self, obj):
        docs = obj.rfpsubmissiondocument_set.filter(document_type='technical')
        return RFPSubmissionDocumentSerializer(
            docs, many=True, context=self.context
        ).data

    def get_commercial_documents(self, obj):
        docs = obj.rfpsubmissiondocument_set.filter(document_type='commercial')
        return RFPSubmissionDocumentSerializer(
            docs, many=True, context=self.context
        ).data


# ===== VIEWS =====

class RFPSubmissionViewSet(viewsets.ViewSet):
    """
    ViewSet for RFP manual bid submissions
    """
    parser_classes = [MultiPartParser, FormParser]  # Important for file uploads

    def create(self, request):
        """
        Handle RFP submission creation

        Expected FormData:
        - solicitation: UUID
        - vendor: UUID
        - technical_documents: File[] (multiple files)
        - commercial_documents: File[] (multiple files)
        - evaluations: JSON string (optional)
        """

        # Parse multiple files from request
        data = request.data.copy()

        # Handle multiple file uploads
        technical_files = request.FILES.getlist('technical_documents')
        commercial_files = request.FILES.getlist('commercial_documents')

        data['technical_documents'] = technical_files
        data['commercial_documents'] = commercial_files

        # Parse evaluations if it's a JSON string
        if 'evaluations' in data and isinstance(data['evaluations'], str):
            try:
                data['evaluations'] = json.loads(data['evaluations'])
            except json.JSONDecodeError:
                return Response(
                    {
                        "status": false,
                        "error_code": "invalid_json",
                        "message": "Invalid JSON in evaluations field",
                        "data": null
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Validate and create submission
        serializer = RFPSubmissionSerializer(data=data)

        if serializer.is_valid():
            try:
                submission = serializer.save()

                # Return response with created data
                response_serializer = RFPSubmissionResponseSerializer(
                    submission,
                    context={'request': request}
                )

                return Response(
                    {
                        "status": true,
                        "message": "RFP proposal submitted successfully",
                        "data": response_serializer.data
                    },
                    status=status.HTTP_201_CREATED
                )

            except Exception as e:
                return Response(
                    {
                        "status": false,
                        "error_code": "server_error",
                        "message": str(e),
                        "data": null
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            # Return validation errors
            errors = serializer.errors
            first_error = next(iter(errors.values()))[0] if errors else "Validation failed"

            return Response(
                {
                    "status": false,
                    "error_code": "validation_error",
                    "message": str(first_error),
                    "data": errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )


# ===== URL CONFIGURATION =====

"""
# In your urls.py:

from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'manaul-bid', RFPSubmissionViewSet, basename='rfp-submission')

urlpatterns = [
    path('api/v1/procurements/', include(router.urls)),
]
"""


# ===== TESTING =====

"""
Example test using pytest and Django's test client:

def test_create_rfp_submission():
    # Create test files
    technical_file = SimpleUploadedFile(
        "technical.pdf",
        b"file_content",
        content_type="application/pdf"
    )
    commercial_file = SimpleUploadedFile(
        "commercial.pdf",
        b"file_content",
        content_type="application/pdf"
    )

    # Prepare data
    data = {
        'solicitation': str(solicitation.id),
        'vendor': str(vendor.id),
        'technical_documents': [technical_file],
        'commercial_documents': [commercial_file],
        'evaluations': json.dumps([
            {
                'response': 'Test response',
                'evaluation_criteria': str(criteria.id)
            }
        ])
    }

    # Make request
    response = client.post('/api/v1/procurements/manaul-bid/', data, format='multipart')

    # Assertions
    assert response.status_code == 201
    assert response.data['status'] is True
    assert 'data' in response.data
"""


# ===== IMPORTANT NOTES =====

"""
1. The endpoint URL has a typo: 'manaul' instead of 'manual'
   - Keep it as 'manaul' to match frontend expectations

2. File uploads use MultiPartParser
   - Do NOT use JSONParser for this endpoint

3. Multiple files with same field name
   - Use request.FILES.getlist('technical_documents')
   - NOT request.FILES.get('technical_documents')

4. Evaluations is a JSON string
   - Frontend sends it as a string, not an object
   - Parse it with json.loads() if it's a string

5. File storage
   - Configure your MEDIA_ROOT and MEDIA_URL
   - Consider using cloud storage (S3, Azure) for production

6. Security considerations
   - Validate file types on backend (don't trust frontend)
   - Scan files for malware
   - Set file size limits
   - Use secure file names (avoid using original names directly)

7. Response format
   - Must match the expected structure exactly
   - Include file URLs that are accessible
   - Return all related data (documents, evaluations)
"""
