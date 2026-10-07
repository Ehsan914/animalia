import Icon from "../components/ui/Icon"
import HeroBannerWindow from "../components/banner/HeroBannerWindow"
import { bannerStatus, bannerWhen, discount, displaySeconds } from "../components/banner/heroBanner"
import useEntityManager from "./useEntityManager"
import PageHead from "./PageHead"
import Chip from "./Chip"
import EntityEditor from "./EntityEditor"
import HeroBannerPreview from "./HeroBannerPreview"
import { confirm } from "./feedback"
import { heroBanners } from "../api/resources"
import {
    BANNER_FIELDS, BANNER_STATUS, bannerPayload, bannerToForm, checkBanner, emptyBanner,
} from "./heroBannerForm"

// Live banners first, then switched off, then ended; earliest start first within each.
const STATUS_ORDER = { live: 0, off: 1, ended: 2 }
const byStatus = (a, b) =>
    STATUS_ORDER[bannerStatus(a)] - STATUS_ORDER[bannerStatus(b)] || new Date(a.startDate) - new Date(b.startDate)

// One banner as a card: the banner as a phone shows it, its dates, and an on/off switch.
function BannerCard({ banner, onEdit, onToggle }) {
    const status = BANNER_STATUS[bannerStatus(banner)]
    const pct = discount(banner)
    return (
        <article className="banner-card">
            <div className="banner-thumb" onClick={onEdit}>
                <div className="preview-frame" inert>
                    <HeroBannerWindow banners={[banner]} />
                </div>
            </div>
            <div className="banner-meta">
                <div className="banner-line">
                    <Chip tone={status.tone}>{status.label}</Chip>
                    {pct > 0 && <Chip tone="sale">{pct}% off</Chip>}
                    <span className="muted">{bannerWhen(banner)} · {displaySeconds(banner)}s</span>
                </div>
                <h3>{banner.title}</h3>
                <footer>
                    <label className="switch switch--sm">
                        <input type="checkbox" checked={banner.active} onChange={onToggle} />
                        <span className="switch-track" aria-hidden="true" />
                        <span>On the website</span>
                    </label>
                    <span className="drawer-spacer" />
                    <button className="btn btn--sm btn--quiet" type="button" onClick={onEdit} aria-label={`Edit ${banner.title}`}>
                        <Icon name="pencil-simple" />Edit
                    </button>
                </footer>
            </div>
        </article>
    )
}

// Hero Banners keep their own design: a card grid and a wide editor with a live
// preview. Several banners can be live at once; the home page rotates them.
const HeroBannersManager = () => {
    const manager = useEntityManager({
        resource: heroBanners,
        label: "Banner",
        emptyForm: emptyBanner,
        toForm: bannerToForm,
        toPayload: bannerPayload,
    })
    const { modal } = manager
    const list = [...manager.rows].sort(byStatus)

    const toggle = (banner) => {
        const save = (active) => heroBanners.update(banner.id, bannerPayload({ ...bannerToForm(banner), active }))
        manager.changeWithUndo({
            run: () => save(!banner.active),
            undo: () => save(banner.active),
            message: banner.active ? `“${banner.title}” is switched off` : `“${banner.title}” is on the website`,
        })
    }

    const askDelete = async () => {
        const banner = manager.rows.find((b) => b.id === modal.key)
        const ok = await confirm({
            title: "Delete this banner?",
            text: `“${banner.title}” is removed from the website and from this list.`,
        })
        if (!ok) return
        manager.closeModal()
        manager.remove(banner)
    }

    return (
        <>
            <PageHead
                title="Hero Banners"
                subtitle="The window beside the headline on the home page. Live banners take turns"
                addLabel="New banner"
                onAdd={manager.openAdd}
            />

            {list.length ? (
                <div className="banner-grid">
                    {list.map((banner) => (
                        <BannerCard
                            key={banner.id}
                            banner={banner}
                            onEdit={() => manager.openEdit(banner)}
                            onToggle={() => toggle(banner)}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty">
                    <Icon name="image-square" />
                    <h3>{manager.loading ? "Loading…" : "No banners yet"}</h3>
                    {!manager.loading && <p>Without a banner, the home page shows the clinic card.</p>}
                </div>
            )}

            {modal && (
                <EntityEditor
                    title={modal.mode === "add" ? "New banner" : "Edit banner"}
                    saveLabel={modal.mode === "add" ? "Create banner" : "Save"}
                    fields={BANNER_FIELDS}
                    values={modal.form}
                    onChange={manager.changeField}
                    check={checkBanner}
                    onSubmit={manager.submit}
                    onClose={manager.closeModal}
                    onDelete={modal.mode === "edit" ? askDelete : undefined}
                    preview={<HeroBannerPreview banner={modal.form} />}
                />
            )}
        </>
    )
}

export default HeroBannersManager
