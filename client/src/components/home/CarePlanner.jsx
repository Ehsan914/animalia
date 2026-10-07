import { useLayoutEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Icon from "../ui/Icon"
import Seg from "../ui/Seg"
import Stamp from "../ui/Stamp"
import { AGES, CARE, SPECIES, initialCare, visitBookingHref } from "./careGuide"
import usePlannerMotion from "./usePlannerMotion"

// "What's due for your pet?": an interactive pet health card. The controls move at
// once (`care`); the rows follow once the old ones have left (`shown`, whose `n`
// makes every change a fresh set of rows, even back to the same pet and age).
export default function CarePlanner({ services }) {
    const [params] = useSearchParams()
    const [care, setCare] = useState(() => initialCare(params))
    const [shown, setShown] = useState(() => ({ ...care, n: 0 }))

    const sectionRef = useRef(null)
    const cardRef = useRef(null)
    const rowsRef = useRef(null)
    const stampRef = useRef(null)
    const { leave, arrive } = usePlannerMotion({ sectionRef, cardRef, rowsRef, stampRef })

    useLayoutEffect(() => {
        if (shown.n > 0) arrive()
    }, [shown, arrive])

    const change = (key) => (value) => {
        const next = { ...care, [key]: value }
        setCare(next)
        leave(() => setShown((prev) => ({ ...next, n: prev.n + 1 })))
    }

    const rows = CARE[shown.species][shown.age]
    const [firstIcon, firstVisit] = rows[0]

    return (
        <section className="planner on-navy" id="planner" aria-labelledby="planner-title" ref={sectionRef}>
            <div className="wrap planner-grid">
                <div className="planner-intro">
                    <h2 className="h2" id="planner-title">What's due for your pet?</h2>
                    <p className="lede">
                        Pick your pet and their age. The card shows the visits most pets need at that
                        stage, so you know what to book next.
                    </p>
                </div>

                <div className="health-card" ref={cardRef}>
                    <div className="card-head">
                        <p className="card-kicker">Pet health card</p>
                        <p className="card-brand">Animalia Vet Care</p>
                    </div>

                    <div className="card-field">
                        <span className="field-label" aria-hidden="true">Pet</span>
                        <Seg className="seg--species" label="Pet" options={SPECIES} value={care.species} onChange={change("species")} />
                    </div>

                    <div className="card-field">
                        <span className="field-label" aria-hidden="true">Age</span>
                        <Seg className="seg--age" label="Age" options={AGES} value={care.age} onChange={change("age")} />
                    </div>

                    <div className="care-table">
                        <div className="care-head"><span>Visit</span><span>When</span></div>
                        <ol className="care-rows" ref={rowsRef} aria-live="polite">
                            {rows.map(([icon, name, when], i) => (
                                <li className="care-row" key={`${shown.n}-${i}`}>
                                    <Icon name={icon} />
                                    <span className="care-name">{name}</span>
                                    <span className="care-when">{when}</span>
                                </li>
                            ))}
                        </ol>
                        <Stamp word="DUE" className="care-stamp" ref={stampRef} />
                    </div>

                    <div className="card-foot">
                        <p className="card-note">A general guide. Your vet adjusts it at the first exam.</p>
                        <Link className="btn" to={visitBookingHref(firstIcon, services)}>
                            <span>Book: <span>{firstVisit}</span></span>
                            <Icon name="arrow-right" className="icon-arrow" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
