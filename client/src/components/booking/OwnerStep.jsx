import Field from "./Field"

export default function OwnerStep({ booking, errors, onField }) {
    return (
        <fieldset className="step">
            <legend>You</legend>
            <Field
                id="ownerName"
                label="Your name"
                value={booking.ownerName}
                onChange={onField}
                error={errors.ownerName}
                autoComplete="name"
            />
            <div className="field-pair">
                <Field
                    id="phone"
                    label="Phone (WhatsApp)"
                    value={booking.phone}
                    onChange={onField}
                    error={errors.phone}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="01XXX-XXXXXX"
                />
                <Field
                    id="email"
                    label="Email"
                    value={booking.email}
                    onChange={onField}
                    error={errors.email}
                    type="email"
                    autoComplete="email"
                />
            </div>
            <Field
                id="notes"
                label="Anything we should know?"
                optional
                multiline
                rows={3}
                value={booking.notes}
                onChange={onField}
                placeholder="Symptoms, medicines, or if your pet gets nervous"
            />
        </fieldset>
    )
}
