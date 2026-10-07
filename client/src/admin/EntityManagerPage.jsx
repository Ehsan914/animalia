import { Plus } from "lucide-react"
import Button from "../components/ui/Button"
import EntityTable from "./EntityTable"
import EntityModal from "./EntityModal"

/**
 * The standard admin page: heading, "Add" button, table and edit modal, driven
 * by a useEntityManager() result. Pass `rows` to show a subset of the records,
 * `canAdd`/`canDelete` false to hide those actions, and children for anything
 * below the table.
 */
export default function EntityManagerPage({
    title,
    subtitle,
    entityLabel,
    manager,
    columns,
    fields,
    rows = manager.rows,
    canAdd = true,
    canDelete = true,
    children,
}) {
    return (
        <div className="px-7.5 pb-20">
            <div className="w-full flex justify-between items-center">
                <div className="space-y-3 py-5">
                    <h1 className="font-pixel-alt text-[30px] font-semibold leading-8">{title}</h1>
                    <p className="font-sans font-bold text-[16px]">{subtitle}</p>
                </div>
                {canAdd && (
                    <Button
                        onClick={manager.openAdd}
                        className="font-pixel-alt text-[20px] leading-6 flex items-center gap-1.5 px-4 py-2 shadow-mc-sharp-b"
                    >
                        <Plus size={16} color="white" />
                        Add {entityLabel}
                    </Button>
                )}
            </div>

            <EntityTable
                columns={columns}
                rows={rows}
                loading={manager.loading}
                onEdit={manager.openEdit}
                onDelete={canDelete ? manager.remove : undefined}
            />

            {children}

            {manager.modal && (
                <EntityModal
                    fields={fields}
                    formData={manager.modal.form}
                    onChange={manager.changeField}
                    onSubmit={manager.submit}
                    onClose={manager.closeModal}
                    mode={manager.modal.mode}
                    entityLabel={entityLabel}
                />
            )}
        </div>
    )
}
