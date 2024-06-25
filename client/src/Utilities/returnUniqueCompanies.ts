import { UserInterface } from "../interfaces/interfaces";

export function returnUniqueCompanies(receivedUsers: UserInterface[]) {
  const extractedCompanies = Array.from(
    new Set(
      receivedUsers
        .map(({ company }: any) => company)
        .filter((company: string) => company.trim() !== "")
    )
  ).map((company) => ({ name: company }));
  return extractedCompanies;
}
