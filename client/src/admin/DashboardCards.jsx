import { ArrowRight, ArrowUp, Clock } from "lucide-react"
import Button from "../components/ui/Button"

const DashboardCards = ({ cardName, icon, amount, loading, onClick, thisMonth, pendingCount, pendingLabel }) => {
    
    return (
        <div className="flex flex-col gap-5 flex-1 min-w-87.5 border-mc-primary border-4 px-5 py-5 shadow-mc-sharp-lg-b">
            <div className="flex justify-between gap-5">
                <span className="flex items-center gap-2">
                    {icon}
                    <h2 className="text-[20px] font-bold">{cardName}</h2>
                </span>
                <Button 
                    className="shadow-mc-flat-b bg-white 
                    text-black px-3 py-3 border-2 hover:bg-mc-grass
                    hover:text-white transition-colors duration-200"
                    onClick={onClick}>
                        <ArrowRight size={14}/>
                </Button>
            </div>

            <div>
                <h1 className="font-pixel-alt font-bold text-5xl">
                    {loading ? "—" : (amount ?? 0)}
                </h1>
            </div>

            <div className="flex flex-col gap-1.5 mt-auto">
                {thisMonth != null && (
                    <div className="flex gap-1 items-center text-mc-primary">
                        <ArrowUp size={16}/>
                        <p className="font-sans text-[14px] font-bold">+{thisMonth} this month</p>
                    </div>
                )}
                {pendingCount != null && pendingCount > 0 && (
                    <div className="flex gap-1 items-center text-amber-600">
                        <Clock size={16}/>
                        <p className="font-sans text-[14px] font-bold">
                            {pendingCount} {pendingLabel ?? "pending"} for approval
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DashboardCards