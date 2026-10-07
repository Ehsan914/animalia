import { useState } from "react"
import Icon from "../ui/Icon"
import Seg from "../ui/Seg"
import BanglaFont from "./BanglaFont"

const LANGS = [
    { value: "en", label: "English" },
    { value: "bn", label: <span lang="bn">বাংলা</span> },
]

const paragraphs = (text = "") => text.split(/\r?\n/).map((p) => p.trim()).filter(Boolean)

// "Common questions": each answer opens from its question, in English or Bangla.
export default function FaqSection({ faqs }) {
    const [lang, setLang] = useState("en")
    const list = faqs[lang] ?? []
    const bn = lang === "bn"

    if (!faqs.en?.length && !faqs.bn?.length) return null

    return (
        <section className="section section--mist" id="faq">
            <BanglaFont />
            <div className="wrap wrap--narrow">
                <h2 className="h2 section-title" data-reveal>Common questions</h2>
                <div className="faq-lang">
                    <Seg options={LANGS} value={lang} onChange={setLang} label="Language" />
                </div>
                <div className="faq" data-reveal lang={lang}>
                    {list.length === 0 ? (
                        <p className="faq-empty">{bn ? "এখনও কোনো প্রশ্ন যোগ করা হয়নি।" : "No questions here yet."}</p>
                    ) : (
                        list.map((faq) => (
                            <details key={faq.id}>
                                <summary>
                                    {bn ? faq.questionBn : faq.questionEn}
                                    <Icon name="caret-down" />
                                </summary>
                                <div className="answer">
                                    {paragraphs(bn ? faq.answerBn : faq.answerEn).map((p, i) => <p key={i}>{p}</p>)}
                                </div>
                            </details>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}
