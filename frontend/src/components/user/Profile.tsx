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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Icons
import {
  Camera,
  User,
  Mail,
  Phone,
  Calendar,
  Save,
  Edit,
  Loader2,
  CheckCircle,
} from "lucide-react";

// Form validation schema
const profileSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  mobileNumber: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" })
    .regex(/^\d+$/, { message: "Mobile number must contain only digits" }),
});

// Image URL schema
const imageSchema = z.object({
  profileImageUrl: z.string().url({ message: "Must be a valid URL" })
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type ImageFormValues = z.infer<typeof imageSchema>;

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const token = Cookies.get("token");

  // Initialize form with zod resolver
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
    },
  });

  const imageForm = useForm<ImageFormValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      profileImageUrl: "",
    },
  });

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { firstName, lastName, email, mobileNumber, regDate, profileImage } = res.data;
        const profileData = {
          firstName,
          lastName,
          email,
          mobileNumber,
          profileImage,
          memberSince: regDate ? new Date(regDate) : new Date(),
          status: "Active",
        };

        setUser(profileData);
        form.reset({
          firstName,
          lastName,
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

    fetchProfile();
  }, [token]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      setSubmitting(true);
      
      await axios.patch(
        `${BACKEND_URL}/api/user/profile`,
        {
          firstName: values.firstName,
          lastName: values.lastName,
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
        firstName: values.firstName,
        lastName: values.lastName,
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

  const onImageSubmit = async (values: ImageFormValues) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      setSubmitting(true);
      
      await axios.patch(
        `${BACKEND_URL}/api/user/profile`,
        {
          profileImage: values.profileImageUrl,
          firstName: user.firstName,
          lastName: user.lastName,
          mobileNumber: user.mobileNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setUser({
        ...user,
        profileImage: values.profileImageUrl,
      });
      
      toast.success("Profile image updated successfully!");
      setImageDialogOpen(false);
      imageForm.reset();
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update profile image");
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
      className="flex justify-center p-6"
      initial="hidden"
      animate="visible"
      variants={profileVariants}
    >
      <div className="w-full max-w-2xl">
        <Card className="overflow-hidden border-blue-100 dark:border-blue-900/30 shadow-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          
          {/* Profile Header with Avatar */}
          <div className="relative bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/20 border-b border-blue-100 dark:border-blue-900/30 p-6 pb-24">
            {/* Decorative shapes */}
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100/50 dark:bg-blue-900/20 rounded-full -mb-12 -ml-12"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full -mt-16 -mr-16"></div>
            
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-blue-950 dark:text-blue-100 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Your Profile
              </h2>
              <p className="text-blue-700/70 dark:text-blue-400/70 text-sm">
                Manage your personal information and settings
              </p>
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
                    <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-zinc-900 group-hover:ring-blue-200 dark:group-hover:ring-blue-800 transition-all duration-300 shadow-xl">
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
                      className="absolute bottom-1 right-1 h-8 w-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600"
                      title="Change profile picture"
                      onClick={() => setImageDialogOpen(true)}
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
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!editMode}
                              className={`h-11 ${editMode 
                                ? "bg-blue-50/50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-800/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0" 
                                : "bg-zinc-50 dark:bg-zinc-900"}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!editMode}
                              className={`h-11 ${editMode 
                                ? "bg-blue-50/50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-800/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0" 
                                : "bg-zinc-50 dark:bg-zinc-900"}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                          <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={true}
                            className="h-11 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 select-none"
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
                        <FormLabel className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                          <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Mobile Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!editMode}
                            className={`h-11 ${editMode 
                              ? "bg-blue-50/50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-800/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0" 
                              : "bg-zinc-50 dark:bg-zinc-900"}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Additional Information in a Card */}
                  <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/10 rounded-lg border border-blue-100 dark:border-blue-900/30 p-4 mt-4">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Account Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/80 dark:bg-zinc-900/80 rounded-lg p-3 border border-blue-100/50 dark:border-blue-900/20 backdrop-blur-sm">
                        <div className="text-xs text-blue-500 dark:text-blue-400 mb-1">MEMBER SINCE</div>
                        <div className="text-base font-medium text-zinc-800 dark:text-zinc-200">
                          {user?.memberSince ? format(new Date(user.memberSince), 'PPP') : '-'}
                        </div>
                      </div>
                      
                      <div className="bg-white/80 dark:bg-zinc-900/80 rounded-lg p-3 border border-blue-100/50 dark:border-blue-900/20 backdrop-blur-sm">
                        <div className="text-xs text-blue-500 dark:text-blue-400 mb-1">ACCOUNT STATUS</div>
                        <div className="flex items-center gap-1.5">
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30 h-6">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {user?.status || 'Active'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>

          <CardFooter className="px-6 py-4 border-t border-blue-100 dark:border-blue-900/30 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/5">
            {!loading && (
              <motion.div 
                className="w-full"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type={editMode ? "submit" : "button"}
                  className="w-full h-11 gap-2 hover:cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-blue-500/10 border border-blue-700/10"
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
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Image URL Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md border-blue-100 dark:border-blue-900/30 bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle>Change Profile Image</DialogTitle>
            <DialogDescription>
              Enter the URL of your new profile image.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...imageForm}>
            <form onSubmit={imageForm.handleSubmit(onImageSubmit)} className="space-y-4">
              <FormField
                control={imageForm.control}
                name="profileImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/your-image.jpg" 
                        {...field}
                        className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-800/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="gap-2 sm:gap-0 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImageDialogOpen(false)}
                  className="border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Image</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Profile;
