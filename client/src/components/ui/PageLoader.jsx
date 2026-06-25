const PageLoader = () => (
    <div className="fixed inset-0 z-50 bg-mc-creeper flex flex-col items-center justify-center gap-6">
        <div className="w-14 h-14 border-[5px] border-mc-primary border-t-mc-grass mc-spin" />
        <p className="font-pixel text-[10px] text-mc-primary">Loading...</p>
    </div>
)

export default PageLoader
