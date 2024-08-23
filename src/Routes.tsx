import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import { AboutLazy } from "@/pages/About/About.lazy";
import { ContactsLazy } from "@/pages/Contacts/Contacts.lazy";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/about",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AboutLazy />
          </Suspense>
        ),
      },
      {
        path: "/contacts",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ContactsLazy />
          </Suspense>
        ),
      },
    ],
  },
]);
