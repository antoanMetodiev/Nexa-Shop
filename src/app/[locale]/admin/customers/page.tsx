import { Users } from "lucide-react";
import { getCustomers, CUSTOMERS_PAGE_SIZE } from "@/lib/admin/customers";
import { Pagination } from "@/components/ui/Pagination";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageRaw } = await searchParams;
  const page = pageRaw ? Math.max(1, parseInt(pageRaw, 10) || 1) : 1;
  const { customers, total } = await getCustomers(page);
  const totalPages = Math.max(1, Math.ceil(total / CUSTOMERS_PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-950">
          Клиенти
        </h1>
        <p className="mt-1 text-sm text-navy-500">
          {total} регистрирани потребителя
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy-200 py-20 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-navy-50 text-navy-400">
            <Users className="size-7" />
          </span>
          <p className="font-medium text-navy-950">
            Все още няма регистрирани клиенти
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-400">
                  <th className="px-4 py-3 font-medium">Клиент</th>
                  <th className="px-4 py-3 font-medium">Имейл</th>
                  <th className="px-4 py-3 font-medium">Телефон</th>
                  <th className="px-4 py-3 font-medium">Регистриран на</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-navy-50 last:border-none"
                  >
                    <td className="flex items-center gap-3 px-4 py-3">
                      <span className="flex size-8 items-center justify-center rounded-full bg-navy-100 text-xs font-semibold text-navy-600">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-medium text-navy-950">
                        {customer.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-navy-600">
                      {customer.email}
                    </td>
                    <td className="px-4 py-3 text-navy-600">
                      {customer.phone ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-navy-500">
                      {new Date(customer.createdAt).toLocaleDateString(
                        "bg-BG",
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            basePath="/admin/customers"
            currentPage={page}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}
