// import type { StructureBuilder } from "sanity/structure";

// export const structure = (S: StructureBuilder) =>
//   S.list()
//     .title("Base")
//     .items([
//       S.listItem()
//         .title("Home")
//         .child(S.document().schemaType("home").documentId("home")),
//       ...S.documentTypeListItems().filter(
//         (listItem) => !["home"].includes(listItem.getId() || "")
//       ),
//     ]);

import { Home } from "lucide-react";
import type {
  DefaultDocumentNodeResolver,
  StructureResolver,
} from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .id("root")
    .title("Content")
    .items([
      // Singleton, home page curation
      S.listItem()
        .icon(Home)
        .id("home")
        .schemaType("home")
        .title("Home")
        .child(S.editor().id("home").schemaType("home").documentId("home")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !["home"].includes(listItem.getId() || "")
      ),
    ]);

export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType }
) => {
  switch (schemaType) {
    case `home`:
      return S.document().views([S.view.form()]);
    default:
      return S.document().views([S.view.form()]);
  }
};
