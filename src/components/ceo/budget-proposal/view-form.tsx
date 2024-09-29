"use client";
import {
  BudgetProposal,
  getBudgetProposal,
} from "@/actions/cfo/budget-proposal.action";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { editBudgetProposalStatus } from "@/actions/ceo/budget-proposal.action";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  id: string;
};

export const ViewBudgetProposal = ({ id }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [budgetProposal, setBudgetProposal] = useState<BudgetProposal | null>(null);
  const [ceoComment, setCeoComment] = useState("");

  useEffect(() => {
    const fetchBudgetProposal = async () => {
      try {
        setLoading(true);
        const data = await getBudgetProposal(id);
        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            variant: "destructive",
          });
        } else {
          // Set the proposal data, including CEO comment if available
          setBudgetProposal(data);
          setCeoComment(data.ceoComment || ""); // Set CEO comment from fetched data
        }
      } catch (error) {
        console.error("Failed to fetch Budget Proposal", error);
        toast({
          title: "Error",
          description: "Failed to fetch Budget Proposal. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBudgetProposal();
  }, [id, toast]);

  const handleStatusUpdate = async (status: string) => {
    if (!budgetProposal) return;

    try {
      const result = await editBudgetProposalStatus(id, status, ceoComment);
      if (result.success) {
        toast({
          title: "Success",
          description: `Budget proposal ${status.toLowerCase()} with CEO comment.`,
        });
        setBudgetProposal({ ...budgetProposal, status, ceoComment });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update status", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!budgetProposal) {
    return <div>Project not found.</div>;
  }

  // Disable actions if the proposal has been approved or rejected
  const isActionDisabled = budgetProposal.status === "APPROVED" || budgetProposal.status === "REJECTED";

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl w-full">Budget Proposal</h1>
      <Separator />
      <div className="flex flex-col gap-5 w-auto">
        <div className="flex">
          <span className="md:w-60 md:text-lg font-light flex items-center gap-2">
            Proposal Title
          </span>
          <Input disabled className="md:w-[400px] text-[20px]" value={budgetProposal?.proposalTitle || ""} />
        </div>
        <div className="flex">
          <span className="md:w-60 md:text-lg font-light flex items-center gap-2">
            Proposal Number
          </span>
          <Input disabled className="md:w-[400px] text-[20px]" value={budgetProposal?.proposalNumber || ""} />
        </div>
        <div className="flex">
          <span className="md:w-60 md:text-lg font-light flex items-center gap-2">
            Total Budget
          </span>
          <Input disabled className="md:w-[400px] text-[20px]" value={budgetProposal?.totalBudget || ""} />
        </div>
        <div className="flex">
          <span className="md:w-60 md:text-lg font-light flex items-center gap-2">
            Budget Period
          </span>
          <Input disabled className="md:w-[400px] text-[20px]" value={budgetProposal?.budgetPeriod || ""} />
        </div>
        <div className="flex gap-5">
          <div className="flex">
            <span className="md:w-60 md:text-lg font-light flex items-center gap-2">
              Start Date
            </span>
            <Input
              disabled
              className="md:w-[400px] text-[20px]"
              value={budgetProposal?.startDate ? formatDate(budgetProposal.startDate) : ""}
            />
          </div>
          <div className="flex">
            <span className="md:w-60 md:text-lg font-light flex items-center gap-2">
              End Date
            </span>
            <Input
              disabled
              className="md:w-[400px] text-[20px]"
              value={budgetProposal?.endDate ? formatDate(budgetProposal.endDate) : ""}
            />
          </div>
        </div>
        <h1 className="mt-5 text-[23px]">Budget Breakdown</h1>
        <Table className="md:w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableCell className="w-[50px] text-center">S.No</TableCell>
              <TableCell>Department/Category</TableCell>
              <TableCell>Allocated Amount</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgetProposal.budgetBreakdown.map((breakdown, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>{breakdown.proposalCategory}</TableCell>
                <TableCell>{breakdown.allocatedAmount}</TableCell>
                <TableCell>{breakdown.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex gap-5">
          <div className="flex">
            <span className="md:w-60 md:text-lg font-light flex items-center gap-2">
              Justification
            </span>
            <Textarea disabled className="md:w-[400px] text-[15px]" value={budgetProposal?.justification || ""} />
          </div>
          <div className="flex">
            <span className="md:w-60 md:text-lg font-light flex items-center gap-2">
              Potential Risk
            </span>
            <Textarea disabled className="md:w-[400px] text-[15px]" value={budgetProposal?.potentialRisk || ""} />
          </div>
        </div>
        <div className="flex gap-5">
          <div className="flex">
            <span className="md:w-60 md:text-lg font-light flex items-center gap-2">
              Strategy
            </span>
            <Textarea disabled className="md:w-[400px] text-[15px]" value={budgetProposal?.strategy || ""} />
          </div>
          <div className="flex">
            <span className="md:w-60 md:text-lg font-light flex items-center gap-2">
              Alternative
            </span>
            <Textarea disabled className="md:w-[400px] text-[15px]" value={budgetProposal?.alternative || ""} />
          </div>
        </div>
        <div className="flex">
          <span className="md:w-60 md:text-lg font-light flex items-center gap-2">
            CEO Comment
          </span>
          <Textarea
            className="md:w-[400px] text-[15px]"
            value={ceoComment}
            onChange={(e) => setCeoComment(e.target.value)}
            disabled={isActionDisabled} // Disable editing if status is approved/rejected
          />
        </div>
        <div className="flex gap-4 mt-6">
          {!isActionDisabled && (
            <>
              <Button
                asChild
                onClick={() => handleStatusUpdate("APPROVED")}
                className="bg-green-500 hover:bg-green-600"
              >
                <Link href="/ceo/budget-proposal">Approve</Link>
              </Button>
              <Button
                asChild
                onClick={() => handleStatusUpdate("REJECTED")}
                className="bg-red-500 hover:bg-red-600"
              >
                <Link href="/ceo/budget-proposal">Reject</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
