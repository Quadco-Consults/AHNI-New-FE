export default function NotificationContent() {
    return (
        <div className="w-[65%] space-y-2 pt-16 px-8">
            <div className="flex items-center justify-between">
                <h3 className="text-[#344054] text-[12px]">Subject</h3>
                <p className="font-medium">Issues With Health Insurance</p>
            </div>

            <div className="flex items-center justify-between">
                <h3 className="text-[#344054] text-[12px]">Sender</h3>
                <p className="font-medium">Admin</p>
            </div>

            <div className="flex items-center justify-between">
                <h3 className="text-[#344054] text-[12px]">Email</h3>
                <p className="font-medium">support@anhisupport.com</p>
            </div>

            <div className="flex items-center justify-between">
                <h3 className="text-[#344054] text-[12px]">Date Created</h3>
                <p className="font-medium">Nov 16, 2024</p>
            </div>
            <div className="mt-4">
                <h3 className="text-[#344054] text-[12px]">Message</h3>
                <p className="text-[#344054] text-[10px] mt-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nulla facilis maiores veniam eos incidunt quibusdam
                    laboriosam repellendus totam veritatis perspiciatis non sunt
                    dolorum, ex magni nesciunt rem officia. Odit, nulla animi
                    asperiores harum obcaecati at unde cum consequuntur optio
                    fugiat?
                </p>
            </div>
        </div>
    );
}
