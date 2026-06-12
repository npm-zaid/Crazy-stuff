import React, { useState } from "react";

const services = [
  "A new website",
  "Branding",
  "Motion graphics",
  "E-Commerce",
  "Development",
  "On-going support",
  "App from scratch",
];

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    budget: "",
    message: "",
    newsletter: false,
    privacy: false,
    interests: [],
    attachment: null,
  });

  const toggleInterest = (item) => {
    setFormData((prev) => {
      const isSelected = prev.interests.includes(item);
      return {
        ...prev,
        interests: isSelected
          ? prev.interests.filter((i) => i !== item)
          : [...prev.interests, item],
      };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] || null }));
      return;
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitted data:", {
      ...formData,
      attachment: formData.attachment
        ? {
            name: formData.attachment.name,
            size: formData.attachment.size,
            type: formData.attachment.type,
          }
        : null,
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f7f7] text-black">
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 md:px-10">
        <main className="flex flex-1 flex-col gap-14 pb-16 md:gap-20">
          {/* Hero text + interest pills */}
          <section>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Good things
              <br />
              happen when
              <br />
              you say hey.
            </h1>

            <div className="mt-10">
              <p className="mb-4 text-lg font-medium">I am interested in :</p>
              <div className="flex flex-wrap gap-4">
                {services.map((item) => {
                  const isActive = formData.interests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`rounded-full border border-black px-6 py-2 text-sm font-medium backdrop-blur-sm transition ${
                        isActive
                          ? "bg-black text-white"
                          : "bg-transparent text-black hover:bg-black hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Form */}
          <section>
            <form
              onSubmit={handleSubmit}
              className="space-y-10 text-sm md:text-base"
            >
              <div className="grid gap-10 md:grid-cols-3">
                {/* First name */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium">
                    First name*
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-3 w-full border-b border-black bg-transparent pb-2 outline-none"
                  />
                </div>

                {/* Last name */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium">
                    Last name*
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-3 w-full border-b border-black bg-transparent pb-2 outline-none"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium">Email*</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-3 w-full border-b border-black bg-transparent pb-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-10 md:grid-cols-3">
                {/* Budget */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">
                    Budget (£)
                  </label>
                  <input
                    name="budget"
                    type="text"
                    value={formData.budget}
                    onChange={handleChange}
                    className="mt-3 w-full border-b border-black bg-transparent pb-2 outline-none"
                  />
                  <p className="mt-2 text-xs text-neutral-600">
                    More info on minimum/typical budget sizes can be found{" "}
                    <button
                      type="button"
                      className="underline underline-offset-2"
                    >
                      here
                    </button>
                    .
                  </p>
                </div>

                {/* Attachments */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium">
                    Attachments
                  </label>
                  <div className="mt-3 flex items-center justify-between border-b border-black pb-2 text-sm">
                    <span className="flex items-center gap-2 text-neutral-700">
                      <span aria-hidden="true">📎</span> Add file
                    </span>
                    <input
                      name="attachment"
                      type="file"
                      onChange={handleChange}
                      className="h-6 w-24 opacity-0"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-3 h-32 w-full resize-none border-b border-black bg-transparent pb-2 outline-none"
                />
              </div>

              {/* Checkboxes + submit */}
              <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                      className="h-4 w-4 rounded-full border border-black accent-black"
                    />
                    <span>
                      I'm happy to receive a monthly newsletter from KOTA
                    </span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="privacy"
                      checked={formData.privacy}
                      onChange={handleChange}
                      className="h-4 w-4 rounded-full border border-black accent-black"
                    />
                    <span>
                      I understand that KOTA will securely hold my data in
                      accordance with their privacy policy.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="mt-4 flex items-center gap-2 self-end rounded-full bg-black px-8 py-3 text-sm font-medium text-white md:mt-0"
                >
                  <span>Submit</span>
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M13 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>

      {/* === Bottom black contact section === */}
      <section className="mt-10 bg-black text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:px-10">
          {/* Left: logo + white address card */}
          <div className="md:w-2/3">
            {/* Logo */}
            <div className="mb-8 inline-block border border-white px-3 py-2 text-xs font-semibold tracking-[0.25em]">
              <div>K</div>
              <div>O</div>
              <div>T</div>
              <div>A</div>
            </div>

            {/* White rounded card */}
            <div className="bg-white p-10 text-black md:p-14 rounded-tr-[220px]">
              <div className="grid gap-10 md:grid-cols-2">
                {/* London */}
                <div>
                  <h3 className="text-2xl font-semibold">London</h3>
                  <p className="mt-4 text-sm leading-relaxed">
                    KOTA
                    <br />
                    1–5 Clerkenwell Rd
                    <br />
                    London
                    <br />
                    EC1M 5PA
                  </p>
                </div>

                {/* New York */}
                <div>
                  <h3 className="text-2xl font-semibold">New York</h3>
                  <p className="mt-4 text-sm leading-relaxed">
                    KOTA
                    <br />
                    477 Madison Ave
                    <br />
                    Midtown Manhattan
                    <br />
                    6th Floor, NY 10022
                  </p>
                </div>
              </div>

              <p className="mt-10 text-2xl font-semibold md:text-3xl">
                +44(0)20 3951 0562
              </p>

              <p className="mt-6 text-sm md:text-base">
                Have a quick question you need answering?
                <br />
                Check out – FAQ&apos;s :{" "}
                <a href="#" className="underline underline-offset-2">
                  Working with KOTA
                </a>
              </p>
            </div>
          </div>

          {/* Right: emails + social links */}
          <div className="flex flex-col gap-10 md:w-1/3 md:pt-12">
            <div>
              <p className="text-sm text-neutral-400">General</p>
              <p className="mt-1 text-xl font-semibold md:text-2xl">
                hello@kota.co.uk
              </p>
            </div>

            <div>
              <p className="text-sm text-neutral-400">New business</p>
              <p className="mt-1 text-xl font-semibold md:text-2xl">
                newbiz@kota.co.uk
              </p>
            </div>

            <div>
              <p className="text-sm text-neutral-400">Work with us</p>
              <p className="mt-1 text-xl font-semibold md:text-2xl">
                careers@kota.co.uk
              </p>
            </div>

            <div className="mt-4">
              <p className="text-xl font-semibold md:text-2xl">Follow us</p>
              <ul className="mt-3 space-y-1 text-sm md:text-base">
                <li>
                  <a href="#" className="hover:underline underline-offset-2">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline underline-offset-2">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline underline-offset-2">
                    awwwards
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline underline-offset-2">
                    Clutch
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
