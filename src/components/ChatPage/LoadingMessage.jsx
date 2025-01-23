import React from "react"
import { LazyImage } from "../common/LazyImage"

export const LoadingMessage = () => {
    return (
        <div className="w-full flex justify-start animate-fade-in pb-3 pt-3 pl-4 bg-transparent">
            <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[75%] md:max-w-[65%]">
                {/* Avatar */}
                <div
                    className="h-8 w-8 ring-2 rounded-full flex items-center 
                     justify-center overflow-hidden shrink-0 bg-slate-800"
                >
                    <LazyImage
                        src="https://camper-stories.s3.us-east-2.amazonaws.com/assets/iza-campus.webp"
                        alt="Iza Campus"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Mensaje de carga */}
                <div className="p-3 rounded-lg bg-slate-700/50">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-cyan-400/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-cyan-400/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-cyan-400/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

