<<<<<<< conflict 1 of 1
+++++++ nkoxxyvz cc44d06e (rebase destination)
%%%%%%% diff from: ztnwlylp e8eeb3d5 "Merge pull request #918 from coldfront/fix-gauge-chart" (parents of rebased revision)
\\\\\\\        to: yplmrlks e8361909 "Upgrade to bootstrap5" (rebased revision)
 // SPDX-FileCopyrightText: (C) ColdFront Authors
 //
 // SPDX-License-Identifier: AGPL-3.0-or-later
 
-import DataTable from 'datatables.net-bs4';
+import DataTable from 'datatables.net-bs5';
 
 export function initDataTable(): void {
   const dtables = document.querySelectorAll<HTMLDivElement>(
     'div.table-responsive > table.datatable'
   );
   for (const element of dtables) {
     if (element !== null) {
       new DataTable(element, {
         pageLength: 10,
         orderClasses: false,
         order: [[1, 'desc']],
       });
     }
   }
 
   const dtablesLong = document.querySelectorAll<HTMLDivElement>(
     'div.table-responsive > table.datatable-long'
   );
   for (const element of dtablesLong) {
     if (element !== null) {
       new DataTable(element, {
         pageLength: 50,
         orderClasses: false,
         order: [[1, 'desc']],
       });
     }
   }
 }
>>>>>>> conflict 1 of 1 ends
