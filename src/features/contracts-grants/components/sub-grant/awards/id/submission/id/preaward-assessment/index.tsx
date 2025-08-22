import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { boolean } from "zod";

const preAwardQuestions = {
    assessment_submission: {
        final_rating: {
            low_risk: {
                min: 0,
                max: 29,
                description: "",
            },
            medium_risk: {
                min: 30,
                max: 59,
                description: "",
            },
            high_risk: {
                min: 60,
                max: 89,
                description: "",
            },
            extremely_high_risk: {
                min: 90,
                max: 100,
                description: "",
            },
        },

        rating_scale: {
            na: 0,
            low: 0,
            med: 1,
            high: 2,
        },
    },

    forms: [
        {
            category_name: "General Organization Information",
            category_description:
                "Rate the organization as extremely high, high, medium, or low risk based upon the financial pre-award results",
            category: "",
            max_score: 0,
            questions: [
                {
                    id: "",
                    question:
                        "Is the organization incorporated or legally registered?",
                    requires_explanation: true,
                    answer: {
                        text: "",
                        rating_type: "",
                        boolean: true,
                    },
                    options: {
                        type: "boolean",
                        no_rating: false,
                        text: "",
                        choices: [
                            { yes: true, rating: "low" },
                            { no: false, rating: ["med", "high"] },
                        ],
                    },
                },

                {
                    id: "",
                    question:
                        "City and country of incorporation or legal registration",
                    requires_explanation: true,
                    answer: {
                        text: "",
                        rating_type: "",
                        boolean: true,
                    },
                    options: {
                        type: "",
                        no_rating: true,
                        text: "",
                        choices: [{ yes: true, no: true, rating: "" }],
                    },
                },

                {
                    id: "",
                    question:
                        "Is the organization tax exempt for Value Added Tax (VAT) or Goods and Service Tax (GST)?",
                    requires_explanation: true,
                    answer: {
                        text: "",
                        rating_type: "",
                        boolean: true,
                    },
                    options: {
                        type: "",
                        no_rating: true,
                        text: "",
                        choices: [{ yes: true, no: true, rating: "" }],
                    },
                },

                {
                    id: "",
                    question: "Date of incorporation or legal registration:",
                    requires_explanation: true,
                    answer: {
                        text: "",
                        rating_type: "",
                        boolean: true,
                    },
                    options: {
                        type: "",
                        no_rating: true,
                        text: "",
                        choices: [{ yes: true, no: true, rating: "" }],
                    },
                },

                {
                    id: "",
                    question:
                        "For the current period, have the financial reporting and audit requirements associated with the registration been fulfilled?  If no, what is pending?",
                    requires_explanation: true,
                    answer: {
                        text: "",
                        rating_type: "",
                        boolean: true,
                    },
                    options: {
                        type: "",
                        no_rating: true,
                        text: "",
                        choices: [{ yes: true, no: true, rating: "" }],
                    },
                },

                {
                    id: "",
                    question:
                        "Please list the number of employees of the organization",
                    requires_explanation: true,
                    answer: {
                        text: "",
                        rating_type: "",
                        boolean: true,
                    },
                    options: {
                        type: "",
                        no_rating: true,
                        text: "",
                        choices: [{ yes: true, no: true, rating: "" }],
                    },
                },

                {
                    id: "",
                    question:
                        "Names of banks signatory (Request for account mandate for confirmation)",
                    requires_explanation: true,
                    answer: {
                        text: "",
                        rating_type: "",
                        boolean: true,
                    },
                    options: {
                        type: "",
                        no_rating: true,
                        text: "",
                        choices: [{ yes: true, no: true, rating: "" }],
                    },
                },
                {
                    id: "",
                    question: "Enter the organization's fiscal year:",
                    requires_explanation: true,
                    answer: {
                        text: "",
                        rating_type: "",
                        boolean: true,
                    },
                    options: {
                        type: "",
                        no_rating: true,
                        text: "",
                        choices: [{ yes: true, no: true, rating: "" }],
                    },
                },
            ],
        },
    ],
};

export default function PreAwardAssessment() {
    return (
        <section>
            <div className="flex items-center justify-between">
                <BackNavigation />

                <p className="text-primary font-semibold">Step 1/3</p>
            </div>
            <Card>
                {preAwardQuestions.forms.map((form) => {
                    return (
                        <div className="space-y-3">
                            <h1 className="text-[#DEA004] font-bold uppercase text-lg">
                                {form.category_name}
                            </h1>

                            <p className="text-sm text-gray-500">
                                {form.category_description}
                            </p>

                            {form.questions.map((question, index) => {
                                return (
                                    <Card className="flex items-stretch gap-5">
                                        <span className="font-bold">
                                            {index + 1}
                                        </span>

                                        <div className="space-y-3 flex-1">
                                            <h3 className="font-bold text-md">
                                                {question.question}
                                            </h3>

                                            <div className="flex items-center gap-3">
                                                <button className="w-52 border-solid border-gray-700 border-[1.5px] p-4">
                                                    Yes
                                                </button>
                                                <button className="w-52 border-solid border-gray-700 border-[1.5px] p-4">
                                                    No
                                                </button>
                                            </div>

                                            {question.requires_explanation && (
                                                <div>
                                                    <Label className="font-bold">
                                                        Key Findings
                                                    </Label>

                                                    <Input />
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    );
                })}
            </Card>
        </section>
    );
}
