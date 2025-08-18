import { UseFormReturn } from "react-hook-form";
import { FollowUpData } from "@shared/schema";



import { ArrowLeft, ArrowRight, Send, Clock } from "lucide-react";

interface FollowUpFormProps {
  form: UseFormReturn<FollowUpData>;
  onSubmit: () => void;
  onPrev: () => void;
  onDataChange: (data: FollowUpData) => void;
  isSubmitting: boolean;
}

export default function FollowUpForm({ form, onSubmit, onPrev, onDataChange, isSubmitting }: FollowUpFormProps) {
  const handleSubmit = (data: FollowUpData) => {
    onDataChange(data);
    onSubmit();
    // Scroll to top when generating report
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div >
      <div >
        <div >
          <div >
            <ArrowRight  />
          </div>
          <h3 >Follow-up Preferences</h3>
        </div>
        <p >Let us know how you'd like to proceed after receiving your valuation report.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} >
          <FormField
            control={form.control}
            name="followUpIntent"
            render={({ field }) => (
              <FormItem>
                <FormLabel >
                  Would you like to discuss your valuation results with one of our experts?
                </FormLabel>
                <FormControl>
                  <div >
                    <label >
                      <input 
                        type="radio" 
                        value="yes" 
                        checked={field.value === "yes"}
                        onChange={() => {
                          field.onChange("yes");
                          onDataChange(form.getValues());
                        }}
                         
                      />
                      <div >
                        <div >Yes, schedule a consultation</div>
                        <div >I'd like to discuss the results and explore options for improving my business value or preparing for a potential sale.</div>
                      </div>
                    </label>
                    
                    <label >
                      <input 
                        type="radio" 
                        value="maybe" 
                        checked={field.value === "maybe"}
                        onChange={() => {
                          field.onChange("maybe");
                          onDataChange(form.getValues());
                        }}
                         
                      />
                      <div >
                        <div >Maybe later</div>
                        <div >I'd like to review the report first and may reach out for a consultation in the future.</div>
                      </div>
                    </label>
                    
                    <label >
                      <input 
                        type="radio" 
                        value="no" 
                        checked={field.value === "no"}
                        onChange={() => {
                          field.onChange("no");
                          onDataChange(form.getValues());
                        }}
                         
                      />
                      <div >
                        <div >No thank you</div>
                        <div >I just need the valuation report for my own reference.</div>
                      </div>
                    </label>
                  </div>
                </FormControl>
                <FormMessage  />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalComments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Comments (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={4}
                    
                    placeholder="Any specific areas of interest or questions about your business..."
                    onChange={(e) => {
                      field.onChange(e);
                      onDataChange(form.getValues());
                    }}
                  />
                </FormControl>
                <p >Share any specific goals or questions about your business valuation</p>
                <FormMessage  />
              </FormItem>
            )}
          />

          <div >
            <div >
              <div >
                <Clock  />
              </div>
              <div >
                <p >Processing Time</p>
                <p>Your valuation report will be generated and emailed to you within 5-10 minutes. Please check your email and spam folder.</p>
              </div>
            </div>
          </div>

          <div >
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onPrev}
              
              disabled={isSubmitting}
            >
              <ArrowLeft  />
              Previous
            </Button>
            <Button 
              type="submit" 
              
              disabled={isSubmitting}
            >
              <Send  />
              {isSubmitting ? "Generating Report..." : "Generate Valuation Report"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
