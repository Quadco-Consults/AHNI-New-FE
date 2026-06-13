"use client";

import { useEffect } from "react";
import ConsultantContractDashboard from "@/features/contracts-grants/components/contract-management/consultant-acceptance/index";

export default function ConsultantContractDashboardPage() {
    useEffect(() => {
        const targetTitle = "Consultant Contract Dashboard";

        // Extremely aggressive title setting
        const setTitle = () => {
            document.title = targetTitle;

            // Also try to manipulate the title element directly
            const titleElements = document.querySelectorAll('title');
            titleElements.forEach((el: any) => {
                el.textContent = targetTitle;
                el.innerHTML = targetTitle;
            });

            // Force update head
            const head = document.head || document.getElementsByTagName('head')[0];
            if (head) {
                const existingTitle = head.querySelector('title');
                if (existingTitle) {
                    existingTitle.textContent = targetTitle;
                } else {
                    const newTitle = document.createElement('title');
                    newTitle.textContent = targetTitle;
                    head.appendChild(newTitle);
                }
            }

            console.log("🔄 Title set to:", document.title);
        };

        // Set immediately and repeatedly
        setTitle();

        const intervals = [
            setTimeout(setTitle, 50),
            setTimeout(setTitle, 200),
            setTimeout(setTitle, 500),
            setTimeout(setTitle, 1000),
            setTimeout(setTitle, 2000)
        ];

        // Watch for any changes to title and override immediately
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    if (document.title !== targetTitle) {
                        console.log("🚨 Title changed from", document.title, "to", targetTitle);
                        setTitle();
                    }
                }
            });
        });

        // Observe the entire document for title changes
        observer.observe(document, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // Also specifically observe title element if it exists
        const titleElement = document.querySelector('title');
        if (titleElement) {
            observer.observe(titleElement, { childList: true, characterData: true });
        }

        // Interval to keep checking and fixing title
        const titleCheck = setInterval(() => {
            if (document.title !== targetTitle) {
                console.log("📝 Title check - fixing from", document.title, "to", targetTitle);
                setTitle();
            }
        }, 1000);

        return () => {
            intervals.forEach(clearTimeout);
            clearInterval(titleCheck);
            observer.disconnect();
        };
    }, []);

    return <ConsultantContractDashboard />;
}