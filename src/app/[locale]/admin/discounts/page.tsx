import { Tag } from "lucide-react";
import { getDiscountCodes } from "@/lib/admin/discounts";
import { DiscountForm } from "@/components/admin/DiscountForm";
import { DiscountRow } from "@/components/admin/DiscountRow";

export default async function AdminDiscountsPage() {
  const discounts = await getDiscountCodes();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-navy-950">
        Промо кодове
      </h1>

      <DiscountForm />

      {discounts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy-200 py-20 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-navy-50 text-navy-400">
            <Tag className="size-7" />
          </span>
          <p className="font-medium text-navy-950">Все още няма промо кодове</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-navy-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-400">
                <th className="px-4 py-3 font-medium">Код</th>
                <th className="px-4 py-3 font-medium">Стойност</th>
                <th className="px-4 py-3 font-medium">Употреби</th>
                <th className="px-4 py-3 font-medium">Изтича</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <DiscountRow key={discount.id} discount={discount} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
