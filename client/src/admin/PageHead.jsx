import Icon from "../components/ui/Icon"

// Page title and subtitle, with the page's "Add …" button on the right.
export default function PageHead({ title, subtitle, addLabel, onAdd }) {
    return (
        <header className="page-head">
            <div>
                <h1 className="page-name">{title}</h1>
                <p className="page-sub">{subtitle}</p>
            </div>
            {onAdd && (
                <button className="btn btn--sm" type="button" onClick={onAdd} aria-label={addLabel}>
                    <Icon name="plus" />{addLabel}
                </button>
            )}
        </header>
    )
}
