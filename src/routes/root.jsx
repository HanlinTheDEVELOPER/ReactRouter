import { useEffect } from "react";
import {
  Outlet,
  Link,
  useLoaderData,
  Form,
  redirect,
  NavLink,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";

export default function Root() {
  const { contacts, q } = useLoaderData();
  const { state, location } = useNavigation();
  const submit = useSubmit();

  const searching = location && new URLSearchParams(location.search).has("q");

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearching = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearching,
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>

        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((each) => (
                <li key={each.id}>
                  <NavLink
                    to={`contacts/${each.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    <Link to={`contacts/${each.id}`}>
                      {each.first || each.last ? (
                        <>
                          {each.first} {each.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}
                    </Link>
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>No Contact</p>
          )}
        </nav>
      </div>
      <div id="detail" className={state === "loading" ? "loading" : ""}>
        <Outlet />
      </div>
    </>
  );
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}
