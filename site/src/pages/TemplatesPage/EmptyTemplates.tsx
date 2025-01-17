import Button from "@material-ui/core/Button"
import Link from "@material-ui/core/Link"
import { makeStyles } from "@material-ui/core/styles"
import { Entitlements, TemplateExample } from "api/typesGenerated"
import { CodeExample } from "components/CodeExample/CodeExample"
import { Stack } from "components/Stack/Stack"
import { TableEmpty } from "components/TableEmpty/TableEmpty"
import { TemplateExampleCard } from "components/TemplateExampleCard/TemplateExampleCard"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { Link as RouterLink } from "react-router-dom"
import { Permissions } from "xServices/auth/authXService"

// Those are from https://github.com/coder/coder/tree/main/examples/templates
const featuredExamples = [
  "docker",
  "kubernetes",
  "aws-linux",
  "aws-windows",
  "gcp-linux",
  "gcp-windows",
]

const findFeaturedExamples = (examples: TemplateExample[]) => {
  return examples.filter((example) => featuredExamples.includes(example.id))
}

export const EmptyTemplates: FC<{
  permissions: Permissions
  examples: TemplateExample[]
  entitlements: Entitlements
}> = ({ permissions, examples, entitlements }) => {
  const styles = useStyles()
  const { t } = useTranslation("templatesPage")
  const featuredExamples = findFeaturedExamples(examples)

  if (permissions.createTemplates && entitlements.experimental) {
    return (
      <TableEmpty
        message={t("empty.message")}
        description={
          <>
            You can create a template using our starter templates or{" "}
            <Link component={RouterLink} to="/new">
              uploading a template
            </Link>
            . You can also{" "}
            <Link
              href="https://coder.com/docs/coder-oss/latest/templates#add-a-template"
              target="_blank"
              rel="noreferrer"
            >
              use the CLI
            </Link>
            .
          </>
        }
        cta={
          <Stack alignItems="center" spacing={4}>
            <div className={styles.featuredExamples}>
              {featuredExamples.map((example) => (
                <TemplateExampleCard
                  example={example}
                  key={example.id}
                  className={styles.template}
                />
              ))}
            </div>

            <Button
              size="small"
              component={RouterLink}
              to="/starter-templates"
              className={styles.viewAllButton}
            >
              View all starter templates
            </Button>
          </Stack>
        }
      />
    )
  }

  if (permissions.createTemplates) {
    return (
      <TableEmpty
        className={styles.withImage}
        message={t("empty.message")}
        description={
          <>
            To create a workspace you need to have a template. You can{" "}
            <Link
              target="_blank"
              href="https://coder.com/docs/coder-oss/latest/templates"
            >
              create one from scratch
            </Link>{" "}
            or use a built-in template using the following Coder CLI command:
          </>
        }
        cta={<CodeExample code="coder templates init" />}
        image={
          <div className={styles.emptyImage}>
            <img src="/featured/templates.webp" alt="" />
          </div>
        }
      />
    )
  }

  return (
    <TableEmpty
      className={styles.withImage}
      message={t("empty.message")}
      description={t("empty.descriptionWithoutPermissions")}
      cta={<CodeExample code="coder templates init" />}
      image={
        <div className={styles.emptyImage}>
          <img src="/featured/templates.webp" alt="" />
        </div>
      }
    />
  )
}

const useStyles = makeStyles((theme) => ({
  withImage: {
    paddingBottom: 0,
  },

  emptyImage: {
    maxWidth: "50%",
    height: theme.spacing(40),
    overflow: "hidden",
    opacity: 0.85,

    "& img": {
      maxWidth: "100%",
    },
  },

  featuredExamples: {
    maxWidth: theme.spacing(100),
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: theme.spacing(2),
    gridAutoRows: "min-content",
  },

  template: {
    backgroundColor: theme.palette.background.paperLight,

    "&:hover": {
      backgroundColor: theme.palette.divider,
    },
  },

  viewAllButton: {
    borderRadius: 9999,
  },
}))
