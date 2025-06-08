import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { BACKEND_URL } from "@/utils/backend";
import { motion } from "framer-motion";
import { format } from "date-fns";

// ShadCN UI Components
import {
  Card,
  CardContent,
  CardFooter,

} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Icons
import {
  Edit2,
  Save,
  AtSign,
  User,
  Phone,
  Clock,
  ShieldCheck,
  Camera,
  Loader2,
  Calendar,
  UserCircle,
  BadgeCheck,
} from "lucide-react";

// Form validation schema
const profileSchema = z.object({
  adminName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  mobileNumber: z
    .string()
    .length(10, { message: "Mobile number must be 10 digits" })
    .regex(/^\d+$/, { message: "Mobile number must contain only digits" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const token = Cookies.get("adminToken");

  // Initialize form with zod resolver
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      adminName: "",
      email: "",
      mobileNumber: "",
    },
  });

  useEffect(() => {
    if (!token) return;

    const fetchAdminProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/api/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { adminName, email, mobileNumber, adminRegDate, profileImage } = res.data;
        const profileData = {
          adminName,
          email,
          mobileNumber,
          profileImage,
          memberSince: adminRegDate ? new Date(adminRegDate) : new Date(),
          status: "Active",
        };

        setUser(profileData);
        form.reset({
          adminName,
          email,
          mobileNumber,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [token]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      setSubmitting(true);
      
      await axios.patch(
        `${BACKEND_URL}/api/admin/profile`,
        {
          adminName: values.adminName,
          mobileNumber: values.mobileNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setUser({ 
        ...user, 
        adminName: values.adminName,
        mobileNumber: values.mobileNumber
      });
      
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  // Animation variants
  const profileVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 } 
    }
  };

  return (
    <motion.div 
      className="p-6"
      initial="hidden"
      animate="visible"
      variants={profileVariants}
    >
      <div className="max-w-3xl mx-auto">
        <Card className="overflow-hidden border-cyan-100 dark:border-cyan-900/30 shadow-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          
          {/* Profile Header with Avatar */}
          <div className="relative bg-gradient-to-r from-cyan-50/80 to-blue-50/80 dark:from-cyan-950/30 dark:to-blue-950/20 border-b border-cyan-100 dark:border-cyan-900/30 p-6 pb-24">
            {/* Decorative shapes */}
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-100/50 dark:bg-cyan-900/20 rounded-full -mb-12 -ml-12"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 dark:bg-blue-900/20 rounded-full -mt-16 -mr-16"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-cyan-950 dark:text-cyan-200 flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  Admin Profile
                </h2>
                <p className="text-cyan-700/70 dark:text-cyan-400/70 text-sm">
                  Manage your personal information and settings
                </p>
              </div>
              {!loading && (
                <Badge 
                  variant="outline" 
                  className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/30 px-3 py-1.5 font-medium"
                >
                  <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                  Active Account
                </Badge>
              )}
            </div>
          </div>

          {/* Avatar Overlay */}
          <div className="relative h-0">
            <div className="absolute left-6 -top-20 z-10">
              <div className="relative group">
                {loading ? (
                  <Skeleton className="h-32 w-32 rounded-full border-4 border-white dark:border-zinc-900" />
                ) : (
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-zinc-900 group-hover:ring-cyan-200 dark:group-hover:ring-cyan-800 transition-all duration-300 shadow-xl">
                      <img
                        src={user?.profileImage || "https://avatar.iran.liara.run/public"}
                        alt="Profile"
                        className={`h-full w-full object-cover transition-all duration-700 ${
                          avatarLoaded ? "scale-100 blur-0" : "scale-110 blur-sm"
                        }`}
                        onLoad={() => setAvatarLoaded(true)}
                      />
                    </div>
                    <button 
                      className="absolute bottom-1 right-1 h-8 w-8 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cyan-600"
                      title="Change profile picture"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <CardContent className="mt-24 pt-0 px-6">
            {loading ? (
              <div className="space-y-5 py-4">
                <Skeleton className="h-10 w-full bg-cyan-100/50 dark:bg-cyan-900/20" />
                <Skeleton className="h-10 w-full bg-cyan-100/50 dark:bg-cyan-900/20" />
                <Skeleton className="h-10 w-full bg-cyan-100/50 dark:bg-cyan-900/20" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                  <FormField
                    control={form.control}
                    name="adminName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-medium">
                          <User className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!editMode}
                            className={`h-11 ${editMode 
                              ? "bg-cyan-50/50 dark:bg-cyan-950/10 border-cyan-200 dark:border-cyan-800/30 focus-visible:ring-2 focus-visible:ring-cyan-500/30 focus-visible:ring-offset-0" 
                              : "bg-zinc-50 dark:bg-zinc-900"}`}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-medium">
                          <AtSign className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={true}
                            className="h-11 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400"
                          />
                        </FormControl>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          Email addresses cannot be changed
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-medium">
                          <Phone className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                          Mobile Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!editMode}
                            className={`h-11 ${editMode 
                              ? "bg-cyan-50/50 dark:bg-cyan-950/10 border-cyan-200 dark:border-cyan-800/30 focus-visible:ring-2 focus-visible:ring-cyan-500/30 focus-visible:ring-offset-0" 
                              : "bg-zinc-50 dark:bg-zinc-900"}`}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Additional Information in a Card */}
                  <div className="bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/10 rounded-lg border border-cyan-100 dark:border-cyan-900/30 p-4 mt-4">
                    <h3 className="text-sm font-medium text-cyan-800 dark:text-cyan-300 mb-3 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      Account Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/80 dark:bg-zinc-900/80 rounded-lg p-3 border border-cyan-100/50 dark:border-cyan-900/20 backdrop-blur-sm">
                        <div className="text-xs text-cyan-500 dark:text-cyan-400 mb-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> MEMBER SINCE
                        </div>
                        <div className="text-base font-medium text-zinc-800 dark:text-zinc-200">
                          {format(user?.memberSince, 'PPP')}
                        </div>
                      </div>
                      
                      <div className="bg-white/80 dark:bg-zinc-900/80 rounded-lg p-3 border border-cyan-100/50 dark:border-cyan-900/20 backdrop-blur-sm">
                        <div className="text-xs text-cyan-500 dark:text-cyan-400 mb-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> LAST UPDATED
                        </div>
                        <div className="text-base font-medium text-zinc-800 dark:text-zinc-200">
                          {format(new Date(), 'PPP')}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>

          <CardFooter className="px-6 py-4 border-t border-cyan-100 dark:border-cyan-900/30 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/10 dark:to-blue-950/5">
            {!loading && (
              <motion.div 
                className="w-full"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type={editMode ? "submit" : "button"}
                  className="w-full h-11 gap-2 hover:cursor-pointer bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-400 dark:hover:to-blue-400 text-white dark:text-zinc-900 font-medium shadow-md shadow-cyan-500/10 dark:shadow-cyan-400/5 border border-cyan-700/10 dark:border-cyan-300/20"
                  onClick={editMode ? form.handleSubmit(onSubmit) : () => setEditMode(true)}
                  disabled={submitting}
                >
                  {editMode ? (
                    submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default Profile;
