function MagicCareerAdvice() {
    const advices = [
        "Yes, definitely! You will debug it eventually!",
        "Outlook not so good... maybe try rebooting?",
        "Signs point to yes, but don't quote me on that in your interviews.",
        "Ask again later, after more coffee.",
        "Very doubtful. Have you considered floristry?",
        "Without a doubt, yes. But maybe check Stack Overflow first.",
        "Better not tell you now... it's lunchtime."
    ];

    const [advice, setAdvice] = React.useState("");

    const giveAdvice = () => {
        setAdvice(advices[Math.floor(Math.random() * advices.length)]);
    };

    return (
        <div className="text-center my-4">
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors" onClick={giveAdvice}>
                Ask Career 8-Ball
            </button>
            <p className="mt-2 text-gray-600">{advice || "Click the button for your AI engineering career advice!"}</p>
        </div>
    );
}
