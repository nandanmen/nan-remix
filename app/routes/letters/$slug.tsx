import { useLoaderData, Link, json } from "remix";
import type { LoaderFunction, MetaFunction } from "remix";
import { HiArrowLeft } from "react-icons/hi";
import { motion } from "framer-motion";

import { styled } from "~/stitches.config";
import {
  getLetterFromSlug,
  processLetterAsHtml,
  Letter,
} from "~/lib/newsletter";
import { formatDate, ONE_DAY, ONE_HOUR } from "~/lib/date";

export const loader: LoaderFunction = async ({ params }) => {
  const letter = await getLetterFromSlug(params.slug as string);

  if (!letter) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json(processLetterAsHtml(letter), {
    headers: {
      "cache-control": `public, max-age=${ONE_HOUR}, stale-while-revalidate=${ONE_DAY}`,
    },
  });
};

export const meta: MetaFunction = ({ data }) => {
  return {
    title: data?.subject,
  };
};

export default function Letter() {
  const letter = useLoaderData<Letter>();
  return (
    <Page>
      <LetterLink to="/letters" whileHover="hover">
        <motion.span variants={{ hover: { x: -5 } }}>
          <HiArrowLeft />
        </motion.span>{" "}
        Letters
      </LetterLink>
      <DateWrapper>{formatDate(new Date(letter.publish_date))}</DateWrapper>
      <Title>{letter.subject}</Title>
      <Article dangerouslySetInnerHTML={{ __html: letter.body }} />
    </Page>
  );
}

const DateWrapper = styled("p", {
  color: "$grey600",
  fontFamily: "$mono",
  marginTop: "$16",
  marginBottom: "$4",
});

const LetterLink = styled(motion(Link), {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  textDecoration: "none",
  color: "inherit",

  "&:hover": {
    color: "$blue",
  },

  span: {
    marginRight: "$2",
  },
});

const Page = styled("div", {
  fontFamily: "$sans",
  padding: "$24 $8",
  maxWidth: "calc(40rem + $space$16)",
  margin: "0 auto",
});

const Title = styled("h1", {
  fontFamily: "$serif",
  fontSize: "3rem",
  lineHeight: 1,
  fontWeight: 600,
  marginBottom: "$16",
});

const Article = styled("article", {
  ol: {
    counterReset: "list",
  },

  li: {
    counterIncrement: "list",
    paddingLeft: "$8",
    position: "relative",

    "&:before": {
      content: `counters(list, '.') ". "`,
      position: "absolute",
      left: 0,
      fontFamily: "$mono",
      fontSize: "$sm",
      top: 2,
      color: "$grey600",
    },
  },

  a: {
    color: "$blue",
    textDecoration: "underline",
  },

  code: {
    background: "$grey200",
    fontSize: "$sm",
    padding: "$1",
    borderRadius: 4,
    fontFamily: "$mono",
  },

  "> h2": {
    fontSize: "$2xl",
    fontWeight: 600,
    fontFamily: "$serif",
    marginTop: "$10",
  },

  "> pre": {
    maxWidth: "calc(100% + $space$16)",
    overflowX: "auto",
    background: "$white",
    padding: "$8",
    margin: "$12 -$8",
    marginBottom: "$12 !important",
    border: "2px solid $black",
    borderLeft: "none",
    borderRight: "none",

    "@md": {
      borderRadius: 4,
      borderLeft: "2px solid $black",
      borderRight: "2px solid $black",
    },

    code: {
      background: "transparent",
    },
  },

  "> p > img": {
    maxWidth: "calc(100% + $space$16)",
    margin: "$12 -$8",
    marginBottom: "$12 !important",

    "@md": {
      borderRadius: 4,
    },
  },

  "> hr": {
    marginTop: "$10",
    marginBottom: "$10 !important",
    borderTop: "2px solid $grey200",
  },

  "> :not(:last-child)": {
    marginBottom: "$4",
  },
});
