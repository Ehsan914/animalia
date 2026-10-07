// The navy band under the header on every inner page. `title` is one line or an
// array of lines; each rises out of its own mask (pages.css).
export default function PageHead({ title, lede, meta, className = "", titleClassName = "", titleLang, children }) {
    const lines = Array.isArray(title) ? title : [title]

    return (
        <header className={`page-head on-navy ${className}`.trim()}>
            <div className="wrap">
                {meta}
                <h1 className={`display page-title ${titleClassName}`.trim()} lang={titleLang}>
                    {lines.map((line, i) => (
                        <span className="line" key={i}><span>{line}</span></span>
                    ))}
                </h1>
                {lede && <p className="lede">{lede}</p>}
                {children}
            </div>
        </header>
    )
}
