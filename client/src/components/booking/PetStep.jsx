import Seg from "../ui/Seg"
import Field from "./Field"

const SPECIES_OPTIONS = [
    { value: "Dog", label: "Dog", icon: "dog" },
    { value: "Cat", label: "Cat", icon: "cat" },
    { value: "Other", label: "Other" },
]

export default function PetStep({ booking, errors, onField }) {
    return (
        <fieldset className="step">
            <legend>Your pet</legend>
            <Field
                id="petName"
                label="Pet's name"
                value={booking.petName}
                onChange={onField}
                error={errors.petName}
                autoComplete="off"
                placeholder="e.g. Bruno"
            />
            <div className="field">
                <span className="label" aria-hidden="true">Species</span>
                <Seg
                    label="Species"
                    options={SPECIES_OPTIONS}
                    value={booking.species}
                    onChange={(value) => onField("species", value)}
                />
                {booking.species === "Other" && (
                    <div className="other-species">
                        <label htmlFor="speciesOther" className="sr-only">Which animal?</label>
                        <input
                            id="speciesOther"
                            name="speciesOther"
                            value={booking.speciesOther}
                            onChange={(e) => onField("speciesOther", e.target.value)}
                            aria-invalid={errors.speciesOther ? "true" : undefined}
                            aria-describedby={errors.speciesOther ? "speciesOther-error" : undefined}
                            placeholder="e.g. Rabbit, guinea pig, parrot"
                            autoFocus
                        />
                        <p className="field-error" id="speciesOther-error">{errors.speciesOther}</p>
                    </div>
                )}
            </div>
        </fieldset>
    )
}
