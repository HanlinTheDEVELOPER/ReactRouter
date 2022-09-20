import { deleteContact } from "../contacts";
import { redirect } from "react-router-dom";

export async function action({ params }) {
  //   throw new Error("Shit");
  await deleteContact(params.contactId);
  return redirect("/");
}
