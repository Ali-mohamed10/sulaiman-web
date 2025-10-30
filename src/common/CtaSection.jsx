import { useState } from "react";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
export default function CtaSection() {
  const [isLoggedIn] = useState(localStorage.getItem("isLogin") === "true");
  return (
    <section>
      {/* CTA Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-r from-[--color-primary] to-[--color-secondary] rounded-2xl px-6 py-12 sm:p-12">
            <div className="text-center">
              <h2 className="text-xl md:text-3xl font-bold mb-4">
                Ready to explore all our free tools?
              </h2>
              <p className="text-base md:text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already boosting their
                productivity with our AI tools.
              </p>
              <Link
                to={isLoggedIn ? "/tools" : "/signup"}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-[--color-primary] bg-white dark:bg-background1 hover:bg-gray-100 dark:hover:bg-background1/30 transition-colors duration-200"
              >
                {isLoggedIn ? "Go to Dashboard" : "Get Started for Free"}
                <ArrowForwardIcon className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
