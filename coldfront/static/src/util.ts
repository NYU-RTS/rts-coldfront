<<<<<<< conflict 1 of 1
+++++++ nkoxxyvz cc44d06e (rebase destination)
%%%%%%% diff from: ztnwlylp e8eeb3d5 "Merge pull request #918 from coldfront/fix-gauge-chart" (parents of rebased revision)
\\\\\\\        to: yplmrlks e8361909 "Upgrade to bootstrap5" (rebased revision)
 // SPDX-FileCopyrightText: (C) ColdFront Authors
 //
 // SPDX-License-Identifier: AGPL-3.0-or-later
 
 export function getCookie(name: string) {
   let cookieValue = '';
   if (document.cookie && document.cookie != '') {
     const cookies = document.cookie.split(';');
     for (let i = 0; i < cookies.length; i++) {
       const cookie = jQuery.trim(cookies[i]);
       // Does this cookie string begin with the name we want?
       if (cookie.substring(0, name.length + 1) == name + '=') {
         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
         break;
       }
     }
   }
   return cookieValue;
 }
+
+/**
+ * Generator that yields HTML elements by CSS query selector
+ * @param query - CSS query selector string
+ * @param container - Optional container to search within (defaults to document)
+ * @yields HTMLElement - HTML elements (never null)
+ */
+export function* getElementsByQueryGenerator(
+  query: string,
+  container: Document | HTMLElement = document
+): Generator<HTMLElement, void, undefined> {
+  const elements = container.querySelectorAll(query);
+  for (let i = 0; i < elements.length; i++) {
+    yield elements[i] as HTMLElement;
+  }
+}
>>>>>>> conflict 1 of 1 ends
