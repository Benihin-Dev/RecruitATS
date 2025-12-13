
"use client";

export default function Features() {
    const features = [
        {
            icon: "🚀",
            title: "Smart Job Posting",
            desc: "Create beautiful job posts with AI-assisted descriptions and custom fields in seconds.",
            color: "bg-orange-100 text-orange-600"
        },
        {
            icon: "👥",
            title: "Applicant Pipeline",
            desc: "Drag-and-drop kanban style tracking for all your candidates. Visualize your hiring flow.",
            color: "bg-blue-100 text-blue-600"
        },
        {
            icon: "📊",
            title: "Insightful Analytics",
            desc: "Know exactly where your best candidates are coming from and optimize your spend.",
            color: "bg-green-100 text-green-600"
        },
        {
            icon: "🤝",
            title: "Team Collaboration",
            desc: "Comment, tag, and rate candidates together. Hiring is a team sport.",
            color: "bg-purple-100 text-purple-600"
        },
        {
            icon: "⚡",
            title: "Fast Screening",
            desc: "Keyboard shortcuts and quick-view modes to screen hundreds of resumes in minutes.",
            color: "bg-yellow-100 text-yellow-600"
        },
        {
            icon: "🔒",
            title: "Enterprise Security",
            desc: "Role-based access control, SSO, and compliance features built-in from day one.",
            color: "bg-gray-100 text-gray-600"
        }
    ];

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm">Features</span>
                    <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">Everything you need to hire</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Powerful features packaged in a simple, intuitive interface designed for modern recruiting teams.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 ${feature.color} custom-shadow`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
