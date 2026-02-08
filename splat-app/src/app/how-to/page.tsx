import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { Footer } from "../components/footer";

export const metadata: Metadata = {
  title: "How to Turn One Photo into a 3D Scene (Free Tool Tutorial) | Timeless Mind",
  description: "Learn how to create stunning 3D gaussian splat scenes from a single photo. Step-by-step guide to transforming your images into interactive 3D memories in under a second.",
  keywords: "gaussian splat single image, easy 3D photo converter, photo to 3D scene tutorial, single image 3D reconstruction, how to create 3D from one photo",
  openGraph: {
    title: "How to Turn One Photo into a 3D Scene - Free Tutorial",
    description: "Complete guide to creating 3D gaussian splat scenes from a single photo using Timeless Mind.",
    type: "article",
  },
};

export default function HowToPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#759AAD] to-[#5a7a8a]">
      <Navbar />

      <article className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              How to Turn One Photo into a 3D Scene
            </h1>
            <p className="text-xl text-white/90 mb-4">
              The Complete Guide to Creating Interactive 3D Gaussian Splat Scenes from a Single Image
            </p>
            <p className="text-white/70">
              Transform any photo into an immersive 3D experience in under a second — completely free, no signup required.
            </p>
          </header>

          {/* Main Content */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl">

            {/* Introduction */}
            <section className="mb-10">
              <p className="text-white/90 text-lg leading-relaxed mb-4">
                In 2025, <strong>photo to 3D scene</strong> technology has revolutionized how we preserve and share memories.
                With 3D content views increasing by over 300% in the past year, creating immersive experiences from a single
                photograph is now easier than ever.
              </p>
              <p className="text-white/90 text-lg leading-relaxed">
                Unlike traditional 3D reconstruction that requires multiple photos or expensive equipment, Timeless Mind uses
                advanced <strong>gaussian splat technology</strong> to generate stunning 3D scenes from just one image.
              </p>
            </section>

            {/* Why Choose Photo to 3D Scene Technology */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-6 border-b border-white/20 pb-2">
                Why Choose Gaussian Splat from a Single Photo?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <h3 className="text-white font-semibold mb-2 flex items-center">
                    <span className="text-2xl mr-2">⚡</span>
                    Lightning Fast
                  </h3>
                  <p className="text-white/80">Generate 3D scenes in under 1 second — no waiting, no processing delays.</p>
                </div>
                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <h3 className="text-white font-semibold mb-2 flex items-center">
                    <span className="text-2xl mr-2">📸</span>
                    One Photo Only
                  </h3>
                  <p className="text-white/80">No need for multiple angles or specialized cameras — just upload one image.</p>
                </div>
                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <h3 className="text-white font-semibold mb-2 flex items-center">
                    <span className="text-2xl mr-2">🔗</span>
                    Instantly Shareable
                  </h3>
                  <p className="text-white/80">Get a unique link to share your 3D scene with anyone — works on any device.</p>
                </div>
                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <h3 className="text-white font-semibold mb-2 flex items-center">
                    <span className="text-2xl mr-2">🆓</span>
                    Completely Free
                  </h3>
                  <p className="text-white/80">No hidden costs, subscriptions, or watermarks. Free forever, no signup needed.</p>
                </div>
              </div>
            </section>

            {/* Step-by-Step Tutorial */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-6 border-b border-white/20 pb-2">
                How to Create a 3D Scene from One Photo: Step-by-Step
              </h2>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white text-xl font-bold shrink-0">
                      1
                    </span>
                    <div className="flex-1">
                      <h3 className="text-white text-xl font-semibold mb-2">Upload Your Photo</h3>
                      <p className="text-white/80 mb-3">
                        Visit <Link href="/" className="text-white underline">Timeless Mind</Link> and click
                        the "Upload an image" button. Select any photo from your device — landscapes, objects,
                        people, or moments work beautifully.
                      </p>
                      <p className="text-white/70 text-sm italic">
                        💡 <strong>Pro tip:</strong> Photos with clear depth and detail produce the most stunning 3D effects.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white text-xl font-bold shrink-0">
                      2
                    </span>
                    <div className="flex-1">
                      <h3 className="text-white text-xl font-semibold mb-2">AI Processing in Under 1 Second</h3>
                      <p className="text-white/80 mb-3">
                        Our AI-powered gaussian splat model (powered by Apple's SHARP algorithm) instantly analyzes
                        your photo and reconstructs it into a fully interactive 3D point cloud scene. This happens
                        automatically — no manual adjustments needed.
                      </p>
                      <p className="text-white/70 text-sm italic">
                        💡 <strong>Behind the scenes:</strong> Advanced neural networks predict depth and spatial relationships
                        to create realistic 3D geometry.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white text-xl font-bold shrink-0">
                      3
                    </span>
                    <div className="flex-1">
                      <h3 className="text-white text-xl font-semibold mb-2">Explore Your 3D Scene</h3>
                      <p className="text-white/80 mb-3">
                        Your image is now a living 3D memory space! Use your mouse or touch controls to:
                      </p>
                      <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                        <li><strong>Orbit:</strong> Click and drag to rotate around your scene</li>
                        <li><strong>Zoom:</strong> Scroll or pinch to move closer or farther</li>
                        <li><strong>Pan:</strong> Right-click and drag to move the view</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white text-xl font-bold shrink-0">
                      4
                    </span>
                    <div className="flex-1">
                      <h3 className="text-white text-xl font-semibold mb-2">Share Your 3D Memory</h3>
                      <p className="text-white/80 mb-3">
                        Click "Copy Share Link" to get a unique URL for your 3D scene. Send it to friends,
                        family, or post it on social media. No app installation required — it works instantly
                        in any web browser.
                      </p>
                      <p className="text-white/70 text-sm italic">
                        💡 <strong>Privacy note:</strong> Your scenes are hosted securely. Only people with the link can access them.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-[#4a6a76]/40 border-l-4 border-white/50 p-6 rounded-r-lg">
                <p className="text-white/90 text-lg font-medium">
                  🎉 <strong>That's it!</strong> You've just created your first <strong>photo to 3D scene</strong> using
                  gaussian splat technology. No complex software, no 3D modeling experience needed.
                </p>
              </div>
            </section>

            {/* Comparison Table */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-6 border-b border-white/20 pb-2">
                Timeless Mind vs Other 3D Photo Tools
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="p-4 text-white font-semibold">Feature</th>
                      <th className="p-4 text-white font-semibold">Timeless Mind</th>
                      <th className="p-4 text-white/70">Luma AI</th>
                      <th className="p-4 text-white/70">Replicate</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/80">
                    <tr className="border-b border-white/10">
                      <td className="p-4 font-medium">Single image required</td>
                      <td className="p-4 text-green-300">✅ Yes</td>
                      <td className="p-4">❌ Needs video/multiple photos</td>
                      <td className="p-4">⚠️ Varies by model</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 font-medium">Processing speed</td>
                      <td className="p-4 text-green-300">✅ Under 1 second</td>
                      <td className="p-4">⏱️ 3-10 minutes</td>
                      <td className="p-4">⏱️ 30-60 seconds</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 font-medium">Cost</td>
                      <td className="p-4 text-green-300">✅ 100% Free</td>
                      <td className="p-4">💰 $1/scene (credits)</td>
                      <td className="p-4">💰 $0.10-$2/run</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 font-medium">No signup required</td>
                      <td className="p-4 text-green-300">✅ Yes</td>
                      <td className="p-4">❌ Account required</td>
                      <td className="p-4">❌ Account required</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 font-medium">Shareable link</td>
                      <td className="p-4 text-green-300">✅ Instant</td>
                      <td className="p-4">✅ Yes</td>
                      <td className="p-4">⚠️ Manual export</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Gaussian splat output</td>
                      <td className="p-4 text-green-300">✅ Yes (.ply)</td>
                      <td className="p-4">✅ Yes</td>
                      <td className="p-4">⚠️ Depends on model</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-6 border-b border-white/20 pb-2">
                Frequently Asked Questions
              </h2>

              <div className="space-y-5">
                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Can I really create a gaussian splat from just one image?
                  </h3>
                  <p className="text-white/80">
                    <strong>Yes!</strong> Timeless Mind uses Apple's SHARP gaussian splat model to reconstruct 3D depth
                    and spatial information from a single photo. While traditional gaussian splatting requires multiple
                    viewpoints, our AI predicts missing data to create a convincing 3D scene.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    What types of photos work best for photo to 3D scene conversion?
                  </h3>
                  <p className="text-white/80">
                    <strong>Any photo works</strong>, but images with clear depth cues produce the best results:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Landscapes with foreground and background elements</li>
                      <li>Indoor scenes with furniture and objects</li>
                      <li>Outdoor architecture and buildings</li>
                      <li>People in environments (not just portraits)</li>
                    </ul>
                    Avoid very flat or close-up images for optimal 3D depth.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Is Timeless Mind really free? Are there any hidden costs?
                  </h3>
                  <p className="text-white/80">
                    <strong>100% free, forever.</strong> No trials, subscriptions, or "freemium" limits.
                    We don't add watermarks, we don't require credit cards, and we don't sell your data.
                    Create unlimited 3D scenes and share them freely.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    How do I download my 3D gaussian splat file?
                  </h3>
                  <p className="text-white/80">
                    After your scene is generated, click the <strong>"Download PLY File"</strong> button.
                    This gives you the raw gaussian splat point cloud (.ply format) that you can use in
                    other 3D software like Blender, Unity, or Unreal Engine.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Can I use my 3D scenes commercially?
                  </h3>
                  <p className="text-white/80">
                    <strong>Yes!</strong> You own the 3D scenes you create from your photos. Use them for
                    personal projects, commercial work, social media, or anywhere else. Just make sure you
                    have the rights to the original photo you upload.
                  </p>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center bg-gradient-to-r from-[#4a6a76]/40 to-[#5a7a8a]/40 rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Create Your First 3D Scene?
              </h2>
              <p className="text-white/90 mb-6 text-lg">
                Transform your photos into immersive 3D memories in under a second.
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-4 bg-white/25 backdrop-blur-md hover:bg-white/35 text-white text-lg font-semibold rounded-full border border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Creating Free →
              </Link>
              <p className="text-white/60 text-sm mt-4">
                No signup required • Takes less than 1 second • Completely free
              </p>
            </section>

          </div>

          {/* Related Keywords Section */}
          <section className="mt-12 text-center">
            <p className="text-white/60 text-sm mb-2">
              <strong className="text-white/80">Related searches:</strong>
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "gaussian splat single image",
                "photo to 3D converter",
                "one photo 3D world",
                "free 3D scene generator",
                "image to gaussian splat",
                "turn photo into 3D model",
                "3D memory creator",
                "single image 3D reconstruction"
              ].map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/70 text-xs border border-white/20"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>

        </div>
      </article>

      <Footer />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Turn One Photo into a 3D Scene",
            "description": "Learn how to create stunning 3D gaussian splat scenes from a single photo using Timeless Mind.",
            "image": "https://timelessmind.app/og-image.jpg",
            "totalTime": "PT1S",
            "tool": [
              {
                "@type": "HowToTool",
                "name": "Timeless Mind"
              }
            ],
            "step": [
              {
                "@type": "HowToStep",
                "name": "Upload Your Photo",
                "text": "Visit Timeless Mind and click the 'Upload an image' button. Select any photo from your device.",
                "position": 1
              },
              {
                "@type": "HowToStep",
                "name": "AI Processing",
                "text": "Our AI-powered gaussian splat model instantly analyzes your photo and reconstructs it into a fully interactive 3D scene.",
                "position": 2
              },
              {
                "@type": "HowToStep",
                "name": "Explore Your 3D Scene",
                "text": "Use mouse or touch controls to orbit, zoom, and pan around your newly created 3D memory space.",
                "position": 3
              },
              {
                "@type": "HowToStep",
                "name": "Share Your 3D Memory",
                "text": "Click 'Copy Share Link' to get a unique URL for your 3D scene and share it with anyone.",
                "position": 4
              }
            ]
          })
        }}
      />

      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Can I really create a gaussian splat from just one image?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Timeless Mind uses Apple's SHARP gaussian splat model to reconstruct 3D depth and spatial information from a single photo. While traditional gaussian splatting requires multiple viewpoints, our AI predicts missing data to create a convincing 3D scene."
                }
              },
              {
                "@type": "Question",
                "name": "What types of photos work best for photo to 3D scene conversion?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Any photo works, but images with clear depth cues produce the best results: landscapes with foreground and background elements, indoor scenes with furniture and objects, outdoor architecture and buildings, and people in environments."
                }
              },
              {
                "@type": "Question",
                "name": "Is Timeless Mind really free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "100% free, forever. No trials, subscriptions, or freemium limits. We don't add watermarks, we don't require credit cards, and we don't sell your data."
                }
              },
              {
                "@type": "Question",
                "name": "How do I download my 3D gaussian splat file?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "After your scene is generated, click the 'Download PLY File' button. This gives you the raw gaussian splat point cloud (.ply format) that you can use in other 3D software like Blender, Unity, or Unreal Engine."
                }
              },
              {
                "@type": "Question",
                "name": "Can I use my 3D scenes commercially?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! You own the 3D scenes you create from your photos. Use them for personal projects, commercial work, social media, or anywhere else."
                }
              }
            ]
          })
        }}
      />
    </main>
  );
}
