import { api } from "~/trpc/server";

export async function CaseList() {
  const cases = await api.case.getAllCases.query();

  return (
    <div className="w-full max-w-xs">
      {cases && cases.length > 0 ? (
        <div>{JSON.stringify(cases)}</div>
      ) : (
        <p>You have no cases yet.</p>
      )}
    </div>
  );
}
