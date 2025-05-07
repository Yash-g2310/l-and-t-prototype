"use client";
import { cn } from "../../lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 shrink-0 border-r border-neutral-200 dark:border-neutral-700 relative",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "70px") : "300px",
        }}
        transition={{
          duration: 0.3, // Slowed down from 0.2 to 0.3
          ease: "easeInOut"
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}>
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-14 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full border-b border-neutral-200 dark:border-neutral-700"
        )}
        {...props}>
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-neutral-800 dark:text-neutral-200"
            onClick={() => setOpen(!open)} />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}>
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
                onClick={() => setOpen(!open)}>
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}) => {
  const { open, animate } = useSidebar();
  return (
    <a
      href={link.href}
      className={cn("flex items-center justify-start gap-2 group/sidebar py-3 px-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors", className)}
      {...props}>
      {/* Ensure icon maintains fixed size */}
      <div className="w-5 h-5 shrink-0 flex items-center justify-center">
        {link.icon}
      </div>
      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          width: animate ? (open ? "auto" : 0) : "auto",
        }}
        transition={{
          duration: 0.25, // Slowed down from 0.15 to 0.25
          ease: "easeInOut"
        }}
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm transition duration-150">
        {link.label}
      </motion.span>
    </a>
  );
};

export const SidebarHeader = ({ children }) => {
  const { open, animate } = useSidebar();
  
  return (
    <motion.div
      className="overflow-hidden px-2"
      animate={{
        opacity: animate ? (open ? 1 : 0) : 1,
        width: animate ? (open ? "100%" : "0%") : "100%",
        marginBottom: animate ? (open ? "16px" : "0px") : "16px",
      }}
      transition={{
        duration: 0.25, // Slowed down from 0.15 to 0.25
        ease: "easeInOut"
      }}
    >
      <div className="min-w-[200px]">
        {children}
      </div>
    </motion.div>
  );
};

export const SidebarFooter = ({ children }) => {
  const { open, animate } = useSidebar();
  
  return (
    <motion.div
      className="mt-auto border-t border-neutral-200 dark:border-neutral-700 pt-4 px-2 overflow-hidden"
      animate={{
        opacity: animate ? (open ? 1 : 0) : 1,
        width: animate ? (open ? "100%" : "0%") : "100%",
      }}
      transition={{
        duration: 0.25, // Slowed down from 0.15 to 0.25
        ease: "easeInOut"
      }}
    >
      <div className="min-w-[200px]">
        {children}
      </div>
    </motion.div>
  );
};