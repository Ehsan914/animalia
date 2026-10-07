const PageLoader = () => (
    <div className="page-loader" role="status">
        <img src="/logo.svg" alt="" width="180" height="51" />
        <div className="page-loader-bar" />
        <span className="sr-only">Loading</span>
    </div>
)

export default PageLoader
