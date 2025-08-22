import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import PdfContent from "components/PdfContent";

export default function Upload() {
    return (
        <Card>
            <CardHeader className="font-bold">
                Uploads
                <Separator className="mt-4" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <PdfContent />
                </div>
            </CardContent>
        </Card>
    );
}
