import React from "react";
import { Link, useLoaderData, json } from "remix";
import { HiArrowRight, HiCheck } from "react-icons/hi";
import { ImSpinner8 } from "react-icons/im";
import { motion } from "framer-motion";
import { blue, green } from "@radix-ui/colors";

import { styled } from "~/stitches.config";
import { getAllLetters, Letter } from "~/lib/newsletter";
import { formatDate } from "~/lib/date";

const ONE_DAY = 60 * 60 * 24;
const ONE_MONTH = ONE_DAY * 30;

export const loader = async () => {
  const letters = await getAllLetters();
  return json(letters, {
    headers: {
      "Cache-Control": `max-age=${ONE_MONTH} stale-while-revalidate=${ONE_DAY}`,
    },
  });
};

export const meta = () => {
  return {
    title: "NaN | Letters",
  };
};

export default function Letters() {
  const [isSubscribeInputOpen, setIsSubscribeInputOpen] = React.useState(false);
  const letters = useLoaderData();
  const formState: string = "idle";

  return (
    <Page>
      <Header>
        <Title>Letters</Title>
        <Blurb>
          An archive of letters from the Not a Number newsletter.{" "}
          <SubscribeLink onClick={() => setIsSubscribeInputOpen(true)}>
            Subscribe
          </SubscribeLink>{" "}
          now to get these letters sent straight to your inbox.
        </Blurb>
        {isSubscribeInputOpen && (
          <SubscriptionBox
            animate={{ y: 0, opacity: 1 }}
            initial={{ y: -8, opacity: 0 }}
          >
            <EmailInput
              name="email"
              type="email"
              placeholder="john.doe@email.com"
            />
            <SubmitButton
              variants={{
                loading: {
                  scale: 0.8,
                },
              }}
              animate={formState}
              whileTap="loading"
              done={formState === "done"}
            >
              {formState === "idle" ? (
                <HiArrowRight size="1.5em" />
              ) : formState === "loading" ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ImSpinner8 size="1.2em" />
                </motion.span>
              ) : (
                <HiCheck size="1.5em" />
              )}
            </SubmitButton>
          </SubscriptionBox>
        )}
      </Header>
      <List layout>
        {letters.map((letter: Letter) => (
          <LetterLink
            key={letter.key}
            title={letter.subject}
            date={new Date(letter.publish_date)}
            slug={letter.key}
          />
        ))}
      </List>
    </Page>
  );
}

const SubscribeLink = styled("button", {
  color: blue.blue10,
  fontFamily: "$serif",
  fontStyle: "italic",
  fontWeight: 600,
});

const SubscriptionBox = styled(motion.form, {
  marginTop: "$4",
  display: "flex",
  gap: "$2",
  maxWidth: "20rem",
});

const SubmitButton = styled(motion.button, {
  width: "44px",
  borderRadius: "6px",
  background: blue.blue10,
  aspectRatio: 1,
  color: "$white",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  variants: {
    done: {
      true: {
        background: green.green10,
      },
    },
  },
});

const EmailInput = styled("input", {
  borderRadius: "6px",
  padding: "$2",
  border: "2px solid $grey300",
  outline: "none",
  width: "100%",

  "&:focus-visible": {
    border: `2px solid ${blue.blue10}`,
  },
});

const Page = styled("div", {
  padding: "$24 $8",
  maxWidth: "calc(40rem + $space$16)",
  margin: "0 auto",
});

const Header = styled("header", {
  marginBottom: "$12",

  "@md": {
    marginBottom: "$20",
  },
});

const Title = styled("h1", {
  fontFamily: "$serif",
  fontSize: "4rem",
  fontWeight: 600,
  marginBottom: "$6",
  marginTop: "$16",
});

const Blurb = styled("p", {
  maxWidth: "65ch",
});

const List = styled(motion.ul, {
  listStyle: "none",
  counterReset: "letters",
});

type LetterLinkProps = {
  title: string;
  slug: string;
  date?: Date;
};

function LetterLink({ title, date = new Date(), slug }: LetterLinkProps) {
  return (
    <LetterWrapper>
      <LetterDate>{formatDate(date)}</LetterDate>
      <LetterTitle to={slug}>
        {title}{" "}
        <span>
          <HiArrowRight />
        </span>
      </LetterTitle>
    </LetterWrapper>
  );
}

const LetterWrapper = styled("li", {
  counterIncrement: "letters",
  position: "relative",
  maxWidth: "70ch",
});

const LetterTitle = styled(Link, {
  fontFamily: "$serif",
  fontWeight: 600,
  fontSize: "$2xl",
  lineHeight: 1,
  marginBottom: "$4",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",

  span: {
    marginLeft: "$4",
  },

  "&:hover": {
    color: "$blue",
  },
});

const LetterDate = styled("p", {
  color: "$grey600",
  marginBottom: "$4",
});
