export default function Footer() {
    return (
        <footer className="w-full py-6 mt-auto border-t border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} ATS. All rights reserved.</p>
                <div className="flex space-x-4 mt-2 md:mt-0">
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
