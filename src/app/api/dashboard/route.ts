import { db } from "@/lib/db";
import { handle, json, requireAuth } from "@/lib/api";
import { ALL_STAGES, STAGES } from "@/lib/constants";

/**
 * GET /api/dashboard
 *
 * Returns:
 * - Job statistics
 * - Candidate and application totals
 * - Upcoming and total interviews
 * - Recruitment pipeline counts
 * - Recent candidate activity
 */
export async function GET(req: Request) {
  return handle(async () => {
    await requireAuth(req);

    // Use the server's local date and time.
    // Interview.date is stored as YYYY-MM-DD.
    const now = new Date();
    const today = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    const currentTime = [
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
    ].join(":");

    const [
      openJobs,
      totalJobs,
      totalCandidates,
      totalApplications,
      scheduledInterviews,
      totalInterviews,
      stageGroups,
      history,
    ] = await Promise.all([
      // Jobs currently accepting applications.
      db.job.count({
        where: { status: "Open" },
      }),

      // All jobs, regardless of status.
      db.job.count(),

      // All candidates.
      db.candidate.count(),

      // All applications.
      db.application.count(),

      // Retrieve scheduled interviews on or after today.
      db.interview.findMany({
        where: {
          status: "Scheduled",
          date: { gte: today },
        },
        select: {
          date: true,
          time: true,
        },
      }),

      // All interviews, including completed and cancelled.
      db.interview.count(),

      // Group applications by recruitment stage.
      db.application.groupBy({
        by: ["stage"],
        _count: {
          _all: true,
        },
      }),

      // Latest ten application history entries.
      db.applicationHistory.findMany({
        orderBy: {
          changedAt: "desc",
        },
        take: 10,
        include: {
          application: {
            select: {
              id: true,
              candidate: {
                select: {
                  name: true,
                },
              },
              job: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Count interviews that have not yet started.
    const upcomingInterviews = scheduledInterviews.filter(
      (interview) => {
        // Future dates are upcoming.
        if (interview.date > today) {
          return true;
        }

        // For today's interviews, compare the scheduled time.
        if (interview.date === today) {
          return interview.time >= currentTime;
        }

        return false;
      }
    ).length;

    // Initialize every known pipeline stage to zero.
    const pipeline: Record<string, number> = {};

    for (const stage of ALL_STAGES) {
      pipeline[stage] = 0;
    }

    // Populate counts returned by Prisma.
    for (const group of stageGroups) {
      pipeline[group.stage] = group._count._all;
    }

    const hires = pipeline["Hired"] ?? 0;
    const rejected = pipeline["Rejected"] ?? 0;

    // Format recent activity for the dashboard.
    const recentActivity = history.map((item) => ({
      id: item.id,
      candidate: item.application.candidate.name,
      job: item.application.job.title,
      previousStage: item.previousStage,
      newStage: item.newStage,
      changedAt: item.changedAt,
    }));

    // Return the dashboard response.
    return json({
      stats: {
        openJobs,
        totalJobs,
        totalCandidates,
        totalApplications,
        upcomingInterviews,
        totalInterviews,
        hires,
        rejected,
      },
      pipelineStages: STAGES,
      pipeline,
      recentActivity,
    });
  });
}