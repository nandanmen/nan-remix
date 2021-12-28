import React from "react";
import {
  Link,
  useLoaderData,
  json,
  Form,
  useTransition,
  useActionData,
} from "remix";
import type { ActionFunction } from "remix";
import { HiArrowRight, HiCheck } from "react-icons/hi";
import { ImSpinner8 } from "react-icons/im";
import { motion } from "framer-motion";
import { blue, green } from "@radix-ui/colors";

import { styled } from "~/stitches.config";
import { getAllLetters, Letter, subscribe } from "~/lib/newsletter";
import { formatDate, ONE_WEEK, ONE_DAY } from "~/lib/date";

export const loader = async () => {
  const letters = await getAllLetters();
  return json(letters, {
    headers: {
      "cache-control": `public, max-age=${ONE_WEEK}, stale-while-revalidate=${ONE_DAY}`,
    },
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  await subscribe(email as string);
  return true;
};

export const meta = () => {
  return {
    title: "NaN | Letters",
  };
};

export default function Letters() {
  const [isSubscribeInputOpen, setIsSubscribeInputOpen] = React.useState(false);
  const letters = useLoaderData();
  const transition = useTransition();
  const success = useActionData();

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
          <>
            <SubscriptionBox
              method="post"
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
                  submitting: {
                    scale: 0.8,
                  },
                }}
                animate={transition.state}
                whileTap="loading"
                done={success}
              >
                {success ? (
                  <HiCheck size="1.5em" />
                ) : transition.state === "submitting" ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ImSpinner8 size="1.2em" />
                  </motion.span>
                ) : (
                  <HiArrowRight size="1.5em" />
                )}
              </SubmitButton>
            </SubscriptionBox>
            {success ? (
              <ConfirmText>
                Thanks! an email was sent to your inbox.
              </ConfirmText>
            ) : null}
          </>
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

const ConfirmText = styled("p", {
  color: "$grey600",
  marginTop: "$4",
  fontFamily: "$mono",
});

const SubscribeLink = styled("button", {
  color: blue.blue10,
  fontFamily: "$serif",
  fontStyle: "italic",
  fontWeight: 600,
});

const SubscriptionBox = styled(motion(Form), {
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
