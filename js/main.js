const app = Vue.createApp({
    data() {
        return {
            tableData: [
                {
                    id: 1,
                    invoice: "Invoice #013 - Jun 2026",
                    billingDate: "2026-06-25",
                    status: "Paid",
                    amount: "50.00",
                    plan: "Premium",
                },
                {
                    id: 2,
                    invoice: "Invoice #012 - May 2026",
                    billingDate: "2026-05-25",
                    status: "Failed",
                    amount: "30.00",
                    plan: "Basic",
                },
                {
                    id: 3,
                    invoice: "Invoice #011 - Apr 2026",
                    billingDate: "2026-04-25",
                    status: "Paid",
                    amount: "25.00",
                    plan: "Pro",
                },
                {
                    id: 4,
                    invoice: "Invoice #010 - Mar 2026",
                    billingDate: "2026-03-25",
                    status: "Failed",
                    amount: "45.00",
                    plan: "Elite",
                },
                {
                    id: 5,
                    invoice: "Invoice #009 - Feb 2026",
                    billingDate: "2026-02-25",
                    status: "Paid",
                    amount: "40.00",
                    plan: "Premium",
                },
                {
                    id: 6,
                    invoice: "Invoice #008 - Jan 2026",
                    billingDate: "2026-01-25",
                    status: "Paid",
                    amount: "20.00",
                    plan: "Basic",
                },
                {
                    id: 7,
                    invoice: "Invoice #007 - Dec 2025",
                    billingDate: "2025-12-25",
                    status: "Failed",
                    amount: "35.00",
                    plan: "Pro",
                },
                {
                    id: 8,
                    invoice: "Invoice #006 - Nov 2025",
                    billingDate: "2025-11-25",
                    status: "Paid",
                    amount: "30.00",
                    plan: "Elite",
                },
                {
                    id: 9,
                    invoice: "Invoice #005 - Oct 2025",
                    billingDate: "2025-10-25",
                    status: "Paid",
                    amount: "25.00",
                    plan: "Basic",
                },
                {
                    id: 10,
                    invoice: "Invoice #004 - Sep 2025",
                    billingDate: "2025-09-25",
                    status: "Failed",
                    amount: "50.00",
                    plan: "Pro",
                },
                {
                    id: 11,
                    invoice: "Invoice #003 - Aug 2025",
                    billingDate: "2025-08-25",
                    status: "Paid",
                    amount: "45.00",
                    plan: "Premium",
                },
                {
                    id: 12,
                    invoice: "Invoice #002 - Jul 2025",
                    billingDate: "2025-07-25",
                    status: "Paid",
                    amount: "30.00",
                    plan: "Elite",
                },
                {
                    id: 13,
                    invoice: "Invoice #001 - Jun 2025",
                    billingDate: "2025-06-25",
                    status: "Failed",
                    amount: "20.00",
                    plan: "Basic",
                },
            ],
            currentPage: 1,
            rowsPerPage: 10,
            toastMessage: "",
            selectedRows: [],
            showModal: false,
            formData: {
                invoice: "",
                billingDate: "",
                status: "Paid",
                amount: "",
                plan: "Basic",
            },
            errors: {},
            sortKey: "", // Current column being sorted
            sortOrder: "asc", // Current sort order ('asc' or 'desc')
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.tableData.length / this.rowsPerPage);
        },
        visiblePages() {
            const maxPagesToShow = 3; // Number of pages to show at the beginning and end in pagination
            const siblingPages = 1; // Number of sibling pages around the current page
            const pages = [];
            const total = this.totalPages;

            // If the total number of pages is less than or equal to 6, showing all pages
            if (total <= 6) {
                for (let i = 1; i <= total; i++) {
                    pages.push(i);
                }
                return pages;
            }

            // Adding first three pages
            for (let i = 1; i <= Math.min(maxPagesToShow, total); i++) {
                pages.push(i);
            }

            // Adding sibling pages and the current page
            const start = Math.max(
                this.currentPage - siblingPages,
                maxPagesToShow + 1
            );
            const end = Math.min(
                this.currentPage + siblingPages,
                total - maxPagesToShow
            );

            if (start > maxPagesToShow + 1) {
                pages.push("...");
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Adding last three pages
            if (end < total - maxPagesToShow) {
                pages.push("...");
            }

            for (
                let i = Math.max(total - maxPagesToShow + 1, end + 1);
                i <= total;
                i++
            ) {
                pages.push(i);
            }

            return pages;
        },
        sortedData() {
            if (!this.sortKey) return this.tableData;
            const sorted = [...this.tableData];
            sorted.sort((a, b) => {
                let result = 0;
                if (a[this.sortKey] < b[this.sortKey]) result = -1;
                if (a[this.sortKey] > b[this.sortKey]) result = 1;
                return this.sortOrder === "asc" ? result : -result;
            });
            return sorted;
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.rowsPerPage;
            const end = start + this.rowsPerPage;
            return this.sortedData.slice(start, end);
        },
        isAllSelected() {
            return this.paginatedData.every((item) =>
                this.selectedRows.includes(item.id)
            );
        },
        isIndeterminate() {
            const currentPageIds = this.paginatedData.map((item) => item.id);
            const selectedOnPage = currentPageIds.filter((id) =>
                this.selectedRows.includes(id)
            );
            return (
                selectedOnPage.length > 0 &&
                selectedOnPage.length < currentPageIds.length
            );
        },
    },
    methods: {
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        toggleSelectAll() {
            const currentPageIds = this.paginatedData.map((item) => item.id);
            if (this.isAllSelected) {
                this.selectedRows = this.selectedRows.filter(
                    (id) => !currentPageIds.includes(id)
                );
            } else {
                this.selectedRows = [
                    ...new Set([...this.selectedRows, ...currentPageIds]),
                ];
            }
        },
        toggleRowSelection(id) {
            if (this.selectedRows.includes(id)) {
                this.selectedRows = this.selectedRows.filter(
                    (rowId) => rowId !== id
                );
            } else {
                this.selectedRows.push(id);
            }
        },
        openModal() {
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.resetForm();
        },
        resetForm() {
            this.formData = {
                invoice: "",
                billingDate: "",
                status: "Paid",
                amount: "",
                plan: "Basic",
            };
            this.errors = {};
        },
        addEntry() {
            if (this.validateForm()) {
                const newEntry = {
                    ...this.formData,
                    id: this.tableData.length + 1,
                };
                this.tableData.push(newEntry);
                this.closeModal();
                this.showToast(event, true, "Record Added Successfully. ");
            }
        },
        validateForm() {
            this.errors = {}; // Reset errors

            // Validate each field
            if (!this.formData.invoice) {
                this.errors.invoice = "Invoice is required.";
            }
            if (!this.formData.billingDate) {
                this.errors.billingDate = "Billing date is required.";
            }
            if (!this.formData.amount) {
                this.errors.amount = "Amount is required.";
            }
            // if there are any errors returning false
            return Object.keys(this.errors).length === 0;
        },
        showToast(event, success = false, message = "") {
            this.toastMessage = message
                ? message
                : "Opps!.. Export not implemented!";
            const toast = document.getElementById("toast");
            toast.classList.add("show");
            console.log("success", success);

            if (success) {
                toast.classList.add("success");
            }
            setTimeout(() => {
                toast.classList.remove("show", "success");
            }, 3000);
        },
        downloadPDF() {
            // Import jsPDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Add content to the PDF
            doc.setFontSize(14);
            doc.text("Billing History Report", 10, 10); // Title
            doc.text("-----------------------", 10, 20); // Divider

            const selectedIDs = this.selectedRows.join(", ");
            doc.text(`Selected IDs: ${selectedIDs}`, 10, 30);

            // Save the PDF with a filename
            doc.save("Billing_History_Report.pdf");
            this.showToast(event, true, "File Downloaded Successfully.");
        },
        sortColumn(key) {
            if (this.sortKey === key) {
                this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
            } else {
                this.sortKey = key;
                this.sortOrder = "asc";
            }
        },
    },
});

app.mount("#app");
