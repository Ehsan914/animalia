import { createContext, useContext, useEffect } from "react"

// Waiting work shown beside "Reviews" and "Appointments" in the sidebar. The layout
// loads the counts once; a page that holds the list keeps them current as it changes.
export const PendingContext = createContext({ counts: {}, report: () => {} })

export const countPending = (rows) => rows.filter((row) => row.status === "pending").length

export const usePendingCounts = () => useContext(PendingContext).counts

// Report the pending count of `rows` (reviews or appointments) once they have loaded.
export function useReportPending(kind, rows, loading) {
    const { report } = useContext(PendingContext)
    const count = countPending(rows)
    useEffect(() => {
        if (!loading) report(kind, count)
    }, [report, kind, count, loading])
}
