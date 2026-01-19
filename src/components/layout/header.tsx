"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Sparkles, Bell, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const motivationalQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "Discipline equals freedom.", author: "Jocko Willink" },
    { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
    { text: "Quality means doing it right when no one is looking.", author: "Henry Ford" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Dreams don't work unless you do.", author: "John C. Maxwell" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
    { text: "If you're not willing to work hard, someone else will.", author: "Mark Cuban" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
    { text: "Well done is better than well said.", author: "Benjamin Franklin" },
    { text: "Opportunities multiply as they are seized.", author: "Sun Tzu" },
    { text: "Work hard in silence, let success make the noise.", author: "Frank Ocean" },
    { text: "Without discipline, success is impossible.", author: "Lou Holtz" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Do the hard jobs first.", author: "Dale Carnegie" },
    { text: "Success is built on daily discipline.", author: "Robin Sharma" },
    { text: "You don't get what you wish for. You get what you work for.", author: "Daniel Milstein" },
    { text: "Work gives you meaning and purpose.", author: "Stephen Hawking" },
    { text: "Excellence is a continuous process, not an accident.", author: "Aristotle" },
    { text: "We are what we repeatedly do.", author: "Aristotle" },
    { text: "The harder I work, the luckier I get.", author: "Gary Player" },
    { text: "Small disciplines repeated daily lead to great achievements.", author: "Jim Rohn" },
    { text: "Don't be busy, be productive.", author: "Tim Ferriss" },
    { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
    { text: "Work ethic eliminates fear.", author: "Michael Jordan" },
    { text: "If it's important, you'll find a way.", author: "Charles Buxton" },
    { text: "Effort only fully releases its reward after a person refuses to quit.", author: "Napoleon Hill" },
    { text: "Genius is 1% inspiration and 99% perspiration.", author: "Thomas Edison" },
    { text: "Focus is about saying no.", author: "Steve Jobs" },
    { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
    { text: "Work like someone is working 24 hours to take it away from you.", author: "Mark Cuban" },
    { text: "Success demands sacrifice.", author: "Lee Kuan Yew" },
    { text: "Productivity is never an accident.", author: "Paul J. Meyer" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
    { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
    { text: "Work hard now so life can be easier later.", author: "Zig Ziglar" },
    { text: "Earn your success based on service.", author: "Zig Ziglar" },
    { text: "Great things come from hard work and perseverance.", author: "Kobe Bryant" },
    { text: "If you're going through hell, keep going.", author: "Winston Churchill" },
    { text: "A dream written down becomes a goal.", author: "Greg S. Reid" },
    { text: "Work until your idols become your rivals.", author: "Drake" },
    { text: "Nothing will work unless you do.", author: "Maya Angelou" },
    { text: "There is no substitute for hard work.", author: "Thomas Edison" },
    { text: "Do what you can, with what you have.", author: "Theodore Roosevelt" },
    { text: "Excellence is not an act, it's a habit.", author: "Aristotle" },
];

export function Header() {
    const { data: session } = useSession();
    const firstName = session?.user?.name?.split(" ")[0] || "Sayang";
    const today = new Date();

    // Random quote - changes on each page load
    const [quote, setQuote] = useState(motivationalQuotes[0]);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        setQuote(motivationalQuotes[randomIndex]);
    }, []);

    // Get greeting based on time
    const hour = today.getHours();
    let greeting = "Good Morning";
    if (hour >= 11 && hour < 15) {
        greeting = "Good Afternoon";
    } else if (hour >= 15 && hour < 18) {
        greeting = "Good Evening";
    } else if (hour >= 18) {
        greeting = "Good Night";
    }

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-sky-100">
            <div className="px-4 py-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4">
                    {/* Mobile - Logo & Greeting */}
                    <div className="flex items-center gap-3 md:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-lg shadow-sky-200">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-sky-800">
                                {greeting}, {firstName}!
                            </h1>
                            <p className="text-xs text-sky-400 line-clamp-1">
                                "{quote.text.slice(0, 40)}..."
                            </p>
                        </div>
                    </div>

                    {/* Desktop - Full greeting with quote */}
                    <div className="hidden md:flex items-center gap-6 flex-1">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-semibold text-sky-800">
                                {greeting}, {firstName}!
                            </h1>
                            <p className="text-sm text-sky-400">
                                {format(today, "EEEE, dd MMMM yyyy", { locale: id })}
                            </p>
                        </div>

                        {/* Motivational Quote - Desktop only */}
                        <div className="hidden lg:flex items-start gap-2 flex-1 max-w-xl border-l border-sky-100 pl-6">
                            <Quote className="h-4 w-4 text-sky-300 flex-shrink-0 mt-0.5" />
                            <div className="min-w-0">
                                <p className="text-sm text-sky-600 italic line-clamp-1">
                                    "{quote.text}"
                                </p>
                                <p className="text-xs text-sky-400">— {quote.author}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Profile & Notification */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden md:flex h-10 w-10 rounded-xl text-sky-400 hover:bg-sky-50 hover:text-sky-600"
                        >
                            <Bell className="h-5 w-5" />
                        </Button>

                        <Link href="/dashboard/profile">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-md shadow-sky-100 hover:scale-105 transition-transform cursor-pointer">
                                <AvatarImage src={session?.user?.image || ""} className="object-cover" />
                                <AvatarFallback className="bg-gradient-to-br from-sky-400 to-blue-500 text-white font-medium">
                                    {firstName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
