// @ts-nocheck
import * as __fd_glob_1 from "../content/engineering/mail-system.mdx?collection=docs"
import * as __fd_glob_0 from "../content/mail-system.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
} & {
  DocData: {
    docs: {
      /**
       * Last modified date of document file, obtained from version control.
       *
       */
      lastModified?: Date;
    },
  }
}>({"doc":{"passthroughs":["extractedReferences","lastModified"]}});

export const docs = await create.docs("docs", "content", {}, {"mail-system.mdx": __fd_glob_0, "engineering/mail-system.mdx": __fd_glob_1, });