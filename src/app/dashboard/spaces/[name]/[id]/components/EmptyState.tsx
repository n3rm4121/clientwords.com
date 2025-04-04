'use client'
import { Button } from "@/components/ui/button";
import { CircleCheck, Copy, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export function EmptyState({ uniqueLink }: { uniqueLink: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(uniqueLink);
            setCopied(true);
            toast.success('Link copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy link');
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg md:p-10">
            <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2 text-center">
                No testimonials yet
            </h2>
            <p className="text-center text-gray-600 mb-4">
                Your testimonial gallery is waiting to be filled with customer love. 
                Share your public testimonial page and start collecting amazing feedback!
            </p>

            <div className="w-full max-w-lg flex flex-col items-center">
                <div className="bg-gray-100 text-gray-700 font-mono text-sm p-4 rounded-md mb-4 w-full overflow-auto">
                    <code className="block break-all">{uniqueLink}
                    <Button
                    onClick={copyToClipboard}
                    className={`inline ml-4 rounded-md focus:outline-none transition-colors duration-200 px-4 py-2 ${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    {copied ? (
                        <>
                            <CircleCheck className="w-4 h-4 text-white" />
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4 text-white" />
                        </>
                    )}
                </Button>
                    </code>
                </div>

               
            </div>
        </div>
    );
}
