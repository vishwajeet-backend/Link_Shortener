"use client";

type UrlItem = {
  id: string;
  shortCode: string;
  shortUrl?: string;
  originalUrl: string;
  status: string;
  clickCount: number;
  createdAt: string;
};

export const UrlTable = ({ items }: { items: UrlItem[] }) => {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <article className="rounded border bg-white p-3 text-sm" key={item.id}>
            <p className="font-medium">{item.shortUrl ?? item.shortCode}</p>
            <p className="mt-1 break-all text-slate-600">{item.originalUrl}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
              <span>Status: {item.status}</span>
              <span>Clicks: {item.clickCount}</span>
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded border bg-white md:block">
        <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-3 py-2">Short</th>
            <th className="px-3 py-2">Original URL</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Clicks</th>
            <th className="px-3 py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr className="border-t" key={item.id}>
              <td className="px-3 py-2">{item.shortUrl ?? item.shortCode}</td>
              <td className="max-w-sm truncate px-3 py-2">{item.originalUrl}</td>
              <td className="px-3 py-2">{item.status}</td>
              <td className="px-3 py-2">{item.clickCount}</td>
              <td className="px-3 py-2">{new Date(item.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </>
  );
};
