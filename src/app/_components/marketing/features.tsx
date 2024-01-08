import {
  ChartBarIcon,
  LockClosedIcon,
  EnvelopeIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Track by case",
    description:
      "Easily view all deposits and disbursements by case. Search and filter by case number, name, or description.",
    icon: BriefcaseIcon,
  },
  {
    name: "Manage permissions",
    description:
      "Permission system allows you to restrict disbursement approval to supervisors only to maintain system integrity.",
    icon: LockClosedIcon,
  },
  {
    name: "Email notifications",
    description:
      "Receive email notifications when requests for disbursements need to be reviewed and approved.",
    icon: EnvelopeIcon,
  },
  {
    name: "Stats at a glance",
    description:
      "Your dashboard provides an overview of current balance, disbursements to date, and pending disbursements.",
    icon: ChartBarIcon,
  },
];

export default function Features() {
  return (
    <div id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Secure property tracking
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your property room
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            PropertyVault is a secure and auditable system for tracking the
            contents of your property room. We provide a central source of truth
            for tracking deposits and disbursements from cases across your
            organization.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
