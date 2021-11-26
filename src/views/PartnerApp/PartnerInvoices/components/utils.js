export function filterInvoices(invoices, filters) {
  let filteredInvoices = invoices;
  if (filters.driver) {
    const searchedDriver = filters.driver.toLowerCase();
    filteredInvoices = filteredInvoices.filter((invoice) => {
      const fullName = invoice.driverFirstName + invoice.driverLastName;
      if (fullName.toLowerCase().search(searchedDriver) >= 0) return invoice;
    });
  }
  if (filters.dateFrom) {
    const dateFrom = new Date(filters.dateFrom);
    filteredInvoices = filteredInvoices.filter((invoice) => {
      if (new Date(invoice.systemEntryDate) >= dateFrom) return invoice;
    });
  }
  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo);
    dateTo.setHours(23, 59, 59, 999);
    filteredInvoices = filteredInvoices.filter((invoice) => {
      if (new Date(invoice.systemEntryDate) <= dateTo) return invoice;
    });
  }
  if (filters.describeBy) {
    filteredInvoices = filteredInvoices.filter((invoice) => {
      if (filters.describeBy === 'DRIVER' && invoice.describedByDriver) return invoice;
      if (filters.describeBy === 'PARTNER' && !invoice.describedByDriver) return invoice;
    });
  }
  return filteredInvoices;
}
