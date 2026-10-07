import PageHead from "./PageHead"
import EntityTable from "./EntityTable"
import EntityEditor from "./EntityEditor"
import { confirm } from "./feedback"

/**
 * The standard admin page: title, "Add …", the table, and the add / edit dialog,
 * driven by a useEntityManager() result. Delete asks first, then offers Undo.
 *
 *   noun        lower-case singular, e.g. "service" ("Add service", "Edit service")
 *   nameOf      (row) => how the delete question names it, e.g. "Health Check-up"
 *   deleteNote  extra line for the delete question
 *   check       (values, modal) => extra errors by field name
 *   rows        a subset of manager.rows to list (e.g. without pending ones)
 *   children    anything below the table
 */
export default function EntityManagerPage({
    title,
    subtitle,
    noun,
    manager,
    columns,
    fields,
    keyOf,
    nameOf,
    deleteNote = "",
    check,
    rows = manager.rows,
    canAdd = true,
    canDelete = true,
    children,
}) {
    const Noun = noun[0].toUpperCase() + noun.slice(1)
    const { modal } = manager

    const askDelete = async (row) => {
        const ok = await confirm({
            title: `Delete ${nameOf(row)}?`,
            text: `It is removed from the website. ${deleteNote}`.trim(),
        })
        if (ok) manager.remove(row)
    }

    return (
        <>
            <PageHead title={title} subtitle={subtitle} addLabel={`Add ${Noun}`} onAdd={canAdd ? manager.openAdd : null} />

            <EntityTable
                columns={columns}
                rows={rows}
                keyOf={keyOf}
                loading={manager.loading}
                onEdit={manager.openEdit}
                onDelete={canDelete ? askDelete : undefined}
            />

            {children}

            {modal && (
                <EntityEditor
                    title={modal.mode === "add" ? `Add ${noun}` : `Edit ${noun}`}
                    saveLabel={modal.mode === "add" ? `Add ${noun}` : "Save changes"}
                    fields={fields}
                    values={modal.form}
                    onChange={manager.changeField}
                    check={check && ((values) => check(values, modal))}
                    onSubmit={manager.submit}
                    onClose={manager.closeModal}
                />
            )}
        </>
    )
}
