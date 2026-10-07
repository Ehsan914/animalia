import Icon from "../ui/Icon"

export default function ServicesStep({ services, selected, error, onToggle }) {
    const picked = new Set(selected)
    return (
        <fieldset className="step">
            <legend>What for</legend>
            <p className="hint" id="services-hint">Pick one or more.</p>
            <div className="chips" id="services" aria-describedby="services-hint">
                {services.map((service) => (
                    <button
                        key={service.id}
                        type="button"
                        className="chip"
                        aria-pressed={picked.has(service.id)}
                        onClick={() => onToggle(service.id)}
                    >
                        <Icon name="check" />
                        {service.title}
                    </button>
                ))}
            </div>
            <p className="field-error" id="services-error">{error}</p>
        </fieldset>
    )
}
