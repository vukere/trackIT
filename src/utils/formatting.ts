import { type ProgressStatus, type ProjectType, type Team } from "@prisma/client";
import dayjs from "dayjs";

export function convertProjectType(projectType: ProjectType) {
  switch (projectType) {
    case "COMPANY":
      return "company";
    case "PERSONAL":
      return "personal";
  }
}

export function convertProgressStatus(status: ProgressStatus) {
  switch (status) {
    case "DONE":
      return "done";
    case "IN_PROGRESS":
      return "in progress";
    case "NOT_STARTED":
      return "not started";
  }
}

export function convertTeam(status: Team) {
  switch (status) {
    case "ALL":
      return "all";
    case "BACKEND":
      return "back-end";
    case "DESIGN":
      return "desing";
    case "FRONTEND":
      return "front-end";
    case "MANAGEMENT":
      return "project management";
    case "NONE":
      return "none";
  }
}

export function formatDate(date: Date) {
  return dayjs(date).format("DD.MM.YYYY");
}
